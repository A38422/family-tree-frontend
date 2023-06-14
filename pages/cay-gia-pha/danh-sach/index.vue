<template>
  <DanhSach />
</template>

<script>
import DanhSach from '../../../components/cay-gia-pha/danh-sach/DanhSach'
export default {
  components: {
    DanhSach,
  },
  middleware: 'auth',

  head() {
    return {
      title: 'List | FamilyTree Manager',
    }
  },
}
</script>
