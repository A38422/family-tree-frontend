<template>
  <DanhSach/>
</template>

<script>
import DanhSach from '~/components/quan-ly-tai-khoan/DanhSach.vue'

export default {
  components: {
    DanhSach
  },

  middleware: 'auth',

  head() {
    return {
      title: 'Account | FamilyTree Manager',
    }
  },
}
</script>
