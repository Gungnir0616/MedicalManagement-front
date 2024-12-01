<template>
  <div class="flex flex-col h-full">
    <el-menu class="w-[14rem] py-[1rem] flex-grow overflow-x-hidden overflow-y-auto"
      text-color="#4b5563" active-text-color="#10b981" unique-opened :collapse="isCollapse" router>

      <el-menu-item :index="menu.name" v-for="menu in menuList" :key="menu.title">
        <el-icon size="14">
          <component :is="menu.icon" />
        </el-icon>
        <span class="font-bold">{{ menu.title }}</span>
      </el-menu-item>
      
      <el-sub-menu :index="menu.name" v-for="menu in subMenuList" v-show="menu.show" :key="menu.title">
        <template #title>
          <el-icon size="14">
            <component :is="menu.icon" />
          </el-icon>
          <span class="font-bold">{{ menu.title }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="item.name" v-for="item in menu.children" :key="item.name" class="font-bold">
          {{item.title}}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
    
    <div class="flex flex-grow-1 w-full my-[1rem] pl-[1.5rem]">
      <div v-if="isCollapse">
        <menu-fold-one v-model="isCollapse" @click="collapseMenu" />
      </div>
      <div v-else>
        <menu-unfold-one v-model="isCollapse" @click="collapseMenu" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  DashboardCar, ApplicationTwo, Peoples,
  MoreFour, MenuFoldOne, MenuUnfoldOne, CategoryManagement,
  SailboatOne,
  ChristmasTree
} from '@icon-park/vue-next';
import { isAdmin, isPatient, isDoctor } from '@/utils';

const isRoot = isAdmin();

const isCollapse = ref(false);

const menuList = [
  {
    name: '/dashboard',
    icon: DashboardCar,
    title: 'Dashboard',
  }
]

const subMenuList = [
  {
    title: 'Patient',
    show: isPatient(),
    name: '/patient',
    icon: ApplicationTwo,
    children: [
      {
        name: '/patient/medical-records_patient',
        title: 'Medical Records'
      }
    ]
  },
  {
    title: 'Doctor',
    show: isDoctor(),
    name: '/doctor',
    icon: Peoples,
    children:[
      {
        name: '/doctor/medical-records_doctor',
        title: 'Medical Records'
      },
      {
        name: '/doctor/patient-managements_doctor',
        title: 'Patient Managements'
      }
    ]
  },
  {
    title: 'Admin',
    icon: CategoryManagement,
    name: "/admin",
    show: isAdmin(),
    children: [
      {
        name: '/doctor/medical-records_doctor',
        title: 'Medical Records'
      },
      {
        name: '/doctor/patient-managements_doctor',
        title: 'Patient Managements'
      },
      {
        name: '/admin/doctor-managements',
        title: 'Doctor Managements'
      }
    ]
  }
]



function collapseMenu() {
  isCollapse.value = !isCollapse.value;
}

</script>

<style scoped>
.el-menu {
  border: none;
}
</style>
