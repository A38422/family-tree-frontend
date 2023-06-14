<template>
  <DanhSach />
</template>

<script>
import DanhSach from '../../../components/tai-chinh/tai-tro/DanhSach'

export default {
  components: {
    DanhSach,
  },
  middleware: 'auth',

  head() {
    return {
      title: 'Sponsor | FamilyTree Manager',
    }
  },
}
</script>
