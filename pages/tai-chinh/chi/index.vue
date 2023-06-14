<template>
  <DanhSach />
</template>

<script>
import DanhSach from '../../../components/tai-chinh/danh-sach-chi/DanhSach'

export default {
  components: {
    DanhSach,
  },
  middleware: 'auth',

  head() {
    return {
      title: 'Expense | FamilyTree Manager',
    }
  },
}
</script>
