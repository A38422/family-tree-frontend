<template>
  <div class="profile-form">
    <div v-if="user.is_admin && user.is_superuser">
      <Avatar
        size="110"
        :style="{
          background: '#0097a7',
          fontFamily: 'arial, sans-serif',
        }">
        {{ user && user.name ? user.name[0].toUpperCase() : 'A' }}
      </Avatar>
    </div>
    <div v-else>
      <Avatar v-if="user && user.img"
              size="130" :src="user.img"
              :style="{
                border: '1px solid #deece7'
              }"/>
    </div>
    <h1>{{ user.name || 'Admin'}}</h1>
    <div>
      <Button type="info" ghost @click="handleOpenModal">
        <Icon type="md-create" />
        Chỉnh sửa
      </Button>
    </div>

    <div :style="{ width: '70%', margin: '7% 0 7% 20%' }">
      <Row :gutter="30">
        <Col span="12">
          <Row>
            <Col span="6">Thế hệ</Col>
            <Col>{{ user.generation || '-' }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="6">Họ và tên</Col>
            <Col>{{ user.name || '-' }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="6">Giới tính</Col>
            <Col>{{ gender(user.gender) }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="6">Ngày sinh</Col>
            <Col>{{ format(user.bdate) }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="6">Ngày mất</Col>
            <Col>{{ format(user.ddate) }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="6">Email</Col>
            <Col>{{ user.email || '-' }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="6">Số điện thoại</Col>
            <Col>{{ user.phone || '-' }}</Col>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col span="8">Địa chỉ</Col>
            <Col>{{ user.address || '-' }}</Col>
          </Row>
          <br>
          <Row>
            <Col span="8">Bố</Col>
            <Col>{{ user.fid ? user.fid.name : '-' }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="8">Mẹ</Col>
            <Col>{{ user.mid ? user.mid.name : '-' }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="8">Vợ/chồng</Col>
            <Col>{{ user.pids && user.pids.length > 0 ? user.pids[0].name : '-' }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="8">Thông tin gia đình</Col>
            <Col>{{ user.family_info || '-' }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="8">Học vấn</Col>
            <Col>{{ getEducation(user.education) }}</Col>
          </Row>
          <br />
          <Row>
            <Col span="8">Thành tựu</Col>
            <Col>{{ user.achievement || '-' }}</Col>
          </Row>
        </Col>
      </Row>
    </div>

    <div class="logout">
      <NuxtLink to="/login">
        <Icon size="20" type="ios-exit-outline"/>
        Đăng xuất
      </NuxtLink>
    </div>

    <UpdateModal ref="refUpdateModal"
                 :is-update="true"
                 :family-tree="familyTree"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { mappingEducations, mappingGender } from '../../constants/mapping'
  import { formatDate } from '../../utils/dateFormatter'
  import UpdateModal from './UpdateModal'

  export default {

    name: 'UserProfile',

    components: {
      UpdateModal
    },

    data() {
      return {
        familyTree: []
      }
    },

    computed: {
      ...mapGetters(['user'])
    },

    created() {
      this.getAllData()
    },

    methods: {
      gender(value) {
        return value ? mappingGender[value] : '-'
      },

      format(date) {
        return date ? formatDate(date) : '-'
      },

      getEducation(value) {
        return value ? mappingEducations[value] : '-'
      },

      handleOpenModal() {
        if (!this.user.is_superuser) {
          this.$refs.refUpdateModal.open()
          this.$refs.refUpdateModal.setFormState({
            ...this.user,
            mid: this.user && this.user.mid ? this.user.mid.id : null,
            fid: this.user && this.user.fid ? this.user.fid.id : null,
            pids: this.user && this.user.pids && this.user.pids.length > 0 ? this.user.pids[0].id : [],
          })
        }
      },

      async getAllData() {
        try {
          this.familyTree = await this.$axios.$get(this.$api.GET_FAMILY_TREE, {
            params: {
              query_all: true
            }
          })
        } catch (e) {
          console.log('error: ', e)
        }
      },
    }
  }
</script>
<style lang="less">
  .profile-form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .logout {
      a {
        font-size: 16px;
        color: #515a6e !important;
      }

      a:hover {
        color: #2d8cf0 !important;
      }
    }
  }
</style>