<template>
  <DanhSach />
</template>

<script>
import DanhSach from '../../../components/tai-chinh/danh-sach-thu/DanhSach'

export default {
  components: {
    DanhSach,
  },

  middleware: 'auth',

  head() {
    return {
      title: 'Income | FamilyTree Manager',
    }
  },
}
</script>
