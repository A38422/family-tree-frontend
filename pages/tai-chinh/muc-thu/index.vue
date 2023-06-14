<template>
  <DanhSach />
</template>

<script>
import DanhSach from '../../../components/tai-chinh/muc-thu/DanhSach'

export default {
  components: {
    DanhSach,
  },
  middleware: 'auth',

  head() {
    return {
      title: 'Contribution Level | FamilyTree Manager',
    }
  },
}
</script>
