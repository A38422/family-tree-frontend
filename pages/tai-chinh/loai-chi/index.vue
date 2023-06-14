<template>
  <DanhSach />
</template>

<script>
import DanhSach from '../../../components/tai-chinh/loai-chi/DanhSach'
export default {
  components: {
    DanhSach,
  },
  middleware: 'auth',

  head() {
    return {
      title: 'Expense Category | FamilyTree Manager',
    }
  },
}
</script>
