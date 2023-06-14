<template>
  <FamilyTree />
</template>
<script>
import FamilyTree from '../../../components/cay-gia-pha/cay/FamilyTree'

export default {
  components: {
    FamilyTree,
  },
  middleware: 'auth',

  head() {
    return {
      title: 'Tree | FamilyTree Manager',
    }
  },
}
</script>
