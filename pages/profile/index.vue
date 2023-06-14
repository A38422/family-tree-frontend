<template>
  <Profile />
</template>

<script>
import Profile from '../../components/profile/Profile'

export default {
  components: {
    Profile,
  },

  middleware: 'auth',

  head() {
    return {
      title: 'Profile | FamilyTree Manager',
    }
  },
}
</script>
