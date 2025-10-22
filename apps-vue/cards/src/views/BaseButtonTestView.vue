<template>
  <div>
    <h1>BaseButton Test</h1>
    <BaseButton>Primary Button</BaseButton>
    <BaseButton variant="secondary">Secondary Button</BaseButton>
    <BaseButton variant="danger">Danger Button</BaseButton>
    <BaseButton variant="success">Success Button</BaseButton>
    <BaseButton variant="ghost">Ghost Button</BaseButton>

    <BaseButton size="sm">Small Button</BaseButton>
    <BaseButton size="md">Medium Button</BaseButton>
    <BaseButton size="lg">Large Button</BaseButton>

    <BaseButton loading>Loading Button</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from '@shared/components/BaseButton.vue';
</script>

<style scoped>
/* Scoped styles for BaseButtonTestView */
</style>
