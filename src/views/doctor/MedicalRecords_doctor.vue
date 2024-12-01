<template>
  <div class="w-full flex justify-center">
    <!-- 创建病例对话框 -->
    <el-dialog v-model="showCreate" top="5vh" title="Create Medical Record" width="60%">
      <el-form ref="createFormRef" :model="newRecord" label-position="top" label-width="auto">
        <div class="flex flex-row w-full space-x-[2rem]">
          <el-form-item label="ID" prop="id" class="w-1/2" required>
            <el-input v-model="newRecord.id" />
            <span class="text-gray-400">The ID of the medical record</span>
          </el-form-item>
          <el-form-item label="Owner" prop="owner" class="w-1/2" required>
            <el-input v-model="newRecord.owner" />
            <span class="text-gray-400">The owner of the medical record</span>
          </el-form-item>
        </div>
        <el-form-item label="Date" prop="date" required>
          <el-date-picker v-model="newRecord.date" type="date" placeholder="Pick a date" />
          <span class="text-gray-400">The date of the record</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="createRecord">Confirm</el-button>
          <el-button @click="showCreate = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 更新病例对话框 -->
    <el-dialog v-model="showUpdate" top="5vh" title="Update Medical Record" width="60%">
      <el-form ref="updateFormRef" :model="updatedRecord" label-position="top" label-width="auto">
        <div class="flex flex-row w-full space-x-[2rem]">
          <el-form-item label="Owner" prop="owner" class="w-1/2" required>
            <el-input v-model="updatedRecord.owner" disabled />
          </el-form-item>
        </div>
        <el-form-item label="Date" prop="date" required>
          <el-date-picker v-model="updatedRecord.date" type="date" placeholder="Pick a date" />
          <span class="text-gray-400">The date of the record</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="updateRecord">Confirm</el-button>
          <el-button @click="showUpdate = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 医疗记录列表 -->
    <div class="flex flex-col w-full h-full px-[4rem] py-[2rem] space-y-[1rem]">

      <div class="flex overflow-hidden rounded-md shadow-md border">
        <div class="flex w-full h-[5rem] items-center">
          <MedicalFiles class="ml-[1rem]" theme="filled" size="42" fill="#94A3B8" />
          <span class="m-[0.75rem] text-2xl font-600">Medical Records</span>
        </div>
      </div>


      <el-card class="h-max">
        <template #header>
          <div class="flex justify-between space-x-[2rem]">
            <el-input v-model="search" placeholder="Type to search">
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <div class="flex space-x-[1rem]">
              <el-button type="primary" plain :icon="MedicalFiles" @click="showCreate = true">Create</el-button>
              <el-button type="primary" plain :icon="RefreshOne" @click="refreshRecords">Refresh</el-button>
            </div>
          </div>
        </template>
        <el-table :data="filteredRecords" height="360" class="w-full max-h-full">
          <el-table-column prop="id" label="ID" sortable />
          <el-table-column prop="date" label="Date" sortable />
          <el-table-column prop="owner" label="Owner" />
          <el-table-column prop="Operation" label="Operation" min-width="120px">
            <template #default="scope">
              <el-button size="small" type="primary" circle @click="downloadRecord(scope.row)" :icon="Download" />
              
              <el-popover :visible="showDelete === scope.$index" placement="top" :width="180">
                <template #reference>
                  <el-button size="small" type="danger" @click="showDeleteConfirm(scope.$index)" :icon="Delete" circle />
                </template>
                <p>Are you sure to delete this record?</p>
                <span class="ml-[0.5rem]">
                  <el-button size="small" text @click="showDelete = -1">Cancel</el-button>
                  <el-button size="small" type="danger" @click="deleteRecord(scope.row)">Confirm</el-button>
                </span>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, unref, onMounted, computed } from 'vue';
import { ElMessage } from "element-plus";
import { MedicalFiles, Search, Download, Delete, RefreshOne } from '@icon-park/vue-next';
import request from '@/axios'; // 确保你已经配置好 axios 实例

const records = ref([
  { id: 1, owner: 'John Doe', date: '2024-06-01' },
  { id: 2, owner: 'Jane Smith', date: '2024-06-02' }
]);
const showCreate = ref(false);
const showUpdate = ref(false);
const showDelete = ref(-1);
const newRecord = ref({
  id: '',
  owner: '',
  date: ''
});
const updatedRecord = ref({
  id: '',
  owner: '',
  date: ''
});
const search = ref('');

const createFormRef = ref();
const updateFormRef = ref();

const filteredRecords = computed(() =>
  records.value.filter(
    (record) =>
      !search.value ||
      record.owner.toLowerCase().includes(search.value.toLowerCase())
  )
);

onMounted(() => {
  fetchRecords();
});

const fetchRecords = () => {
  // 模拟从后端获取数据
  // 根据需要在这里调用实际的 API
};

const refreshRecords = () => {
  ElMessage.success("Refresh success");
};

const createRecord = () => {
  const form = unref(createFormRef);
  if (!form) {
    return;
  }

  form.validate((valid) => {
    if (valid) {
      records.value.push({ ...newRecord.value });
      ElMessage.success("Create success");
      showCreate.value = false;
    } else {
      ElMessage.error("Input invalid");
    }
  });
};

const showUpdateForm = (row) => {
  updatedRecord.value = { ...row };
  showUpdate.value = true;
};

const updateRecord = () => {
  const form = unref(updateFormRef);
  if (!form) {
    return;
  }

  form.validate((valid) => {
    if (valid) {
      const index = records.value.findIndex((v) => v.id === updatedRecord.value.id);
      records.value[index] = { ...updatedRecord.value };
      ElMessage.success("Update success");
      showUpdate.value = false;
    } else {
      ElMessage.error("Input invalid");
    }
  });
};

const showDeleteConfirm = (index) => {
  showDelete.value = index;
};

const deleteRecord = (row) => {
  const index = records.value.findIndex((v) => v.id === row.id);
  records.value.splice(index, 1);
  ElMessage.success("Delete success");
  showDelete.value = -1;
};

const downloadRecord = (row) => {
  const blob = new Blob([JSON.stringify(row)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${row.id}.json`);
  document.body.appendChild(link);
  link.click();
};
</script>

<style scoped>
.el-menu {
  border: none;
}
</style>
