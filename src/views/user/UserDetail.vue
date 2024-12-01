<template>
  <div class="w-full h-full flex justify-center">
    <div class="flex flex-col w-full px-[4rem] py-[2rem] space-y-[1rem]">
      <el-dialog v-model="showUpdate" top="5vh" title="Update User" width="50%">
        <el-form ref="updateFormRef" :model="updatedUser" label-position="top" label-width="auto">
          <el-form-item label="Name" prop="name">
            <el-input v-model="updatedUser.name" disabled />
          </el-form-item>
          <el-form-item label="Email" prop="email" required>
            <el-input v-model="updatedUser.email" />
            <span class="text-gray-400">The user email address</span>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="updateUser">Confirm</el-button>
            <el-button @click="showUpdate = false">Cancel</el-button>
          </span>
        </template>
      </el-dialog>

      <div class="flex flex-col overflow-hidden rounded-md shadow-md border">
        <div class="flex w-full h-[5rem] items-center">
          <User class="ml-[1rem]" theme="filled" size="42" fill="#94A3B8" />
          <span class="m-[0.75rem] text-2xl font-600">User Info</span>
        </div>
        <div class="flex h-[3rem] items-center bg-slate-100">
          <el-button class="ml-[1rem]" plain @Click="showUpdate = true">Update</el-button>
        </div>
      </div>

      <el-card class="flex flex-col h-max">
        <el-descriptions :model="user" size="large" :column=1>
          <el-descriptions-item label="Name">{{ user.name }}</el-descriptions-item>
          <el-descriptions-item label="Email">{{ user.email }}</el-descriptions-item>
          <el-descriptions-item label="CreateAt">{{ user.createdAt }}</el-descriptions-item>
          <div v-for="auth in user.authInfos" :key="auth.authType">
            <el-descriptions-item :label="auth.authType">
              {{ auth.authId }}
            </el-descriptions-item>
          </div>
        </el-descriptions>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { User } from '@icon-park/vue-next';
import { ref, unref, onMounted } from 'vue';
import { ElMessage } from "element-plus";
import request from '@/axios';
import { useRoute } from 'vue-router';
import { getUser } from '@/utils';  // 确保这里有正确导入

const route = useRoute();

const id = route.params.id;

const user = ref({
  name: '',
  email: '',
  createdAt: '',
  authInfos: []
});

const showUpdate = ref(false);
const updatedUser = ref({
  name: '',
  email: '',
  createdAt: '',
  authInfos: []
});

const updateFormRef = ref();

onMounted(() => {
    const loggedInUser = getUser();
    if (!loggedInUser) {
        console.error('No user logged in');
        return;
    }
    user.value = loggedInUser;
    updatedUser.value = { ...loggedInUser };

    console.log('User data loaded:', user.value);
});

const updateUser = () => {
  const form = unref(updateFormRef);
  if (!form) {
    return;
  }

  form.validate((valid) => {
    if (valid) {
      request.put("/api/v1/users/" + updatedUser.value.id, updatedUser.value).then((response) => {
        ElMessage.success("Update success");
        user.value = updatedUser.value;
        showUpdate.value = false;
      }).catch((error) => {
        console.error('Error updating user:', error);
      });
    } else {
      ElMessage.error("Input invalid");
    }
  });
};
</script>
