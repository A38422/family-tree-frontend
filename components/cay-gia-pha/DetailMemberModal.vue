<template>
  <Modal
    v-model="visible"
    :title="title"
    width="900"
    class-name="vertical-center-modal"
  >
    <Row>
      <Col span="12">
        <Row>
          <Col span="6">Thế hệ</Col>
          <Col>{{ formState.generation }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="6">Họ và tên</Col>
          <Col>{{ formState.name }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="6">Giới tính</Col>
          <Col>{{ gender(formState.gender) }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="6">Ngày sinh</Col>
          <Col>{{ format(formState.bdate) }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="6">Ngày mất</Col>
          <Col>{{ format(formState.ddate) }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="6">Email</Col>
          <Col>{{ formState.email || '-' }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="6">Số điện thoại</Col>
          <Col>{{ formState.phone || '-' }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="6">Địa chỉ</Col>
          <Col>{{ formState.address || '-' }}</Col>
        </Row>
      </Col>
      <Col span="12">
        <Row>
          <Col span="8">Bố</Col>
          <Col>{{ findNameById(formState.fid) }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">Mẹ</Col>
          <Col>{{ findNameById(formState.mid) }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">Vợ/chồng</Col>
          <Col>{{ findNameById(formState.pids) }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">Thông tin gia đình</Col>
          <Col>{{ formState.family_info || '-' }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">Học vấn</Col>
          <Col>{{ getEducation(formState.education) }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">Thành tựu</Col>
          <Col>{{ formState.achievement || '-' }}</Col>
        </Row>
        <br />
        <Row>
          <Col span="8">Ảnh</Col>
          <Col>
            <div v-if="formState.img" class="demo-upload-list">
              <img
                :src="formState.img"
                :style="{ fit: 'cover' }"
                width="100%"
                height="100%"
              />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click="handleView"></Icon>
              </div>
            </div>
            <div v-else>-</div>
            <Modal
              v-model="visibleImg"
              title=""
              :footer-hide="true"
              class-name="vertical-center-modal"
            >
              <div :style="{ 'text-align': 'center' }">
                <img
                  v-if="visible"
                  :src="formState.img"
                  :style="{
                    'object-fit': 'cover',
                    width: '100%',
                    'max-height': '700px',
                  }"
                />
              </div>
            </Modal>
          </Col>
        </Row>
      </Col>
    </Row>
    <template #footer>
      <div class="footer-modal-create-member">
        <Button @click="handleClose">Đóng</Button>
      </div>
    </template>
  </Modal>
</template>

<script>
import { formatDate } from '../../utils/dateFormatter'
import { mappingEducations, mappingGender } from '../../constants/mapping'

export default {
  name: 'DetailMemberModal',

  props: {
    familyTree: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      visible: false,
      formState: {
        generation: '',
        name: '',
        gender: '',
        bdate: '',
        ddate: '',
        img: '',
        pids: null,
        fid: null,
        mid: null,
        email: null,
        phone: null,
        address: null,
        family_info: null,
        isAdmin: 'member',
        education: 'none',
        achievement: null,
      },
      visibleImg: false,
    }
  },

  computed: {
    title() {
      return 'Chi tiết thành viên'
    },
  },

  methods: {
    open() {
      this.visible = true
    },

    close() {
      this.visible = false
    },

    handleClose() {
      this.close()
    },

    handleView() {
      this.visibleImg = true
    },

    format(date) {
      return date ? formatDate(date) : '-'
    },

    findNameById(id) {
      return id &&
        this.familyTree.find((item) => item && item.id && item.id === id)
        ? this.familyTree.find((item) => item.id === id).name
        : '-'
      // return  '-'
    },

    gender(value) {
      return value ? mappingGender[value] : '-'
    },

    getEducation(value) {
      return value ? mappingEducations[value] : '-'
    },

    setFormState(data) {
      this.formState =
        data && data.id
          ? {
              ...data,
              pids: data.pids && data.pids.length > 0 ? data.pids[0] : null,
              isAdmin: data.is_admin ? 'admin' : 'member',
            }
          : {
              generation: '',
              name: '',
              gender: '',
              bdate: null,
              ddate: null,
              img: '',
              pids: null,
              fid: null,
              mid: null,
              email: null,
              phone: null,
              address: null,
              family_info: null,
              isAdmin: 'member',
              education: 'none',
              achievement: null,
            }
    },
  },
}
</script>
