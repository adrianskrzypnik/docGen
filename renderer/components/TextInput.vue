<template>
  <div class="flex flex-col items-center">
    <input
      v-model="text"
      type="text"
      placeholder="Enter text here"
      class="p-2 border border-gray-300 rounded mb-4"
    />
    <button
      @click="generateDocument"
      class="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Generate Document
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '',
    };
  },
  methods: {
    generateDocument() {
      console.log('Generating document with text:', this.text);
      // Placeholder for document generation logic
    },
  },
};
</script>

<style scoped>
/* Add any scoped styles here */
</style>
