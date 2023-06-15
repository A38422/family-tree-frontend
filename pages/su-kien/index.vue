<template>
  <DanhSach/>
</template>

<script>
  import DanhSach from '~/components/su-kien/DanhSach.vue'

  export default {
    components: {
      DanhSach
    },

    middleware: 'auth',

    head() {
      return {
        title: 'Event | FamilyTree Manager'
      }
    }
  }
</script>
