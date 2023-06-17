<template>
  <DanhSach />
</template>

<script>
import DanhSach from '../../../components/tai-chinh/bao-cao/DanhSach'

export default {
  components: {
    DanhSach,
  },

  middleware: 'auth',

  head() {
    return {
      title: 'Report - IE | FamilyTree Manager',
    }
  },
}
</script>
