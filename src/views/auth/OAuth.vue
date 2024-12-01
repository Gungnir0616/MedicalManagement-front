<template>
</template>

<script setup>
import { onMounted } from 'vue';
import { ElNotification } from 'element-plus';
import request from '@/axios';
import { useRouter } from 'vue-router';

const router = useRouter(); 

onMounted(
    () => {
        const params = new URLSearchParams(window.location.search);
        const state = params.get("state");
        const code = params.get("code");
        const queryString = atob(state);
        const newParams = new URLSearchParams(queryString);
        const authType = newParams.get("oauth");

        request.post("/api/v1/auth/token", {
            authType : authType,
            authCode: code,
            setCookie: true,
        }).then((response) => {
            const { role } = response.data;
            localStorage.setItem('role', role);

            ElNotification.success({
                title: 'Login Success',
                message: 'Hi~ ' + response.data.name,
                showClose: false,
                duration: 1500,
            });
            router.push('/');
        }).catch((error) => {
            ElNotification.error({
                title: 'Login Failed',
                message: 'Please try again',
                showClose: true,
                duration: 1500,
            });
            console.error("OAuth login error: ", error);
        });
    }
);
</script>
