<template>
  <Modal
    v-model="visible"
    :title="title"
    width="1000"
    class-name="vertical-center-modal form-create-member"
    @on-visible-change="handleChangeVisible"
  >
    <Form
      ref="form"
      label-position="left"
      :model="formState"
      :rules="rules"
      :label-width="130"
    >
      <Row :gutter="24">
        <Col :span="12">
          <FormItem v-if="isUpdate" label="Thế hệ" prop="generation">
            <span>{{ formState.generation }}</span>
          </FormItem>
          <FormItem label="Họ và tên" prop="name">
            <Input
              v-model="formState.name"
              placeholder="Nhập họ và tên"
            ></Input>
          </FormItem>
          <FormItem label="Giới tính" prop="gender">
            <RadioGroup v-model="formState.gender">
              <Radio label="male">Nam</Radio>
              <Radio label="female">Nữ</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="Ngày sinh" prop="bdate">
            <Input v-model="formState.bdate" type="date"></Input>
          </FormItem>
          <FormItem label="Ngày mất (nếu có)" prop="ddate">
            <Input v-model="formState.ddate" type="date"></Input>
          </FormItem>
          <FormItem label="Email" prop="email">
            <Input
              v-model="formState.email"
              type="email"
              placeholder="Nhập email"
            ></Input>
          </FormItem>
          <FormItem label="Số điện thoại" prop="phone">
            <Input
              v-model="formState.phone"
              type="tel"
              placeholder="Nhập số điện thoại"
            ></Input>
          </FormItem>
          <FormItem label="Địa chỉ" prop="address">
            <Input
              v-model="formState.address"
              type="tel"
              placeholder="Nhập địa chỉ"
            ></Input>
          </FormItem>
          <div v-if="!isUpdate" class="flex-row">
            <div :style="{ width: '130px' }">Tạo tài khoản?</div>
            <iSwitch
              v-model="isCreateLogin"
              size="small"
              @on-change="handleChangeSwitch"
            />
          </div>
          <br />
          <div v-if="!isUpdate && isCreateLogin">
            <FormItem label="Tài khoản" prop="username">
              <Input v-model="formState.username" placeholder="Nhập tài khoản">
              </Input>
            </FormItem>
            <FormItem label="Mật khẩu" prop="password">
              <Input
                v-model="formState.password"
                type="password"
                password
                placeholder="Nhập mật khẩu"
              >
              </Input>
            </FormItem>
            <FormItem label="Xác nhận mật khẩu" prop="rePassword">
              <Input
                v-model="formState.rePassword"
                type="password"
                password
                placeholder="Nhập mật khẩu xác nhận"
              >
              </Input>
            </FormItem>
          </div>
        </Col>
        <Col :span="12">
          <FormItem label="Bố (nếu có)" prop="fid">
            <Select
              v-model="formState.fid"
              filterable
              not-found-text="Không có dữ liệu"
              :clearable="true"
              placeholder="Chọn bố"
            >
              <Option
                v-for="item in listFid"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
                <span>{{ item.id }}.</span>
                <Avatar v-if="item.img" :src="item.img" class="mx-5" />
                <Avatar
                  v-else
                  src="https://i.imgur.com/WzMrY0n.png"
                  class="mx-5"
                />
                {{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Mẹ (nếu có)" prop="mid">
            <Select
              v-model="formState.mid"
              filterable
              not-found-text="Không có dữ liệu"
              :clearable="true"
              placeholder="Chọn mẹ"
            >
              <Option
                v-for="item in listMid"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
                <span>{{ item.id }}.</span>
                <Avatar v-if="item.img" :src="item.img" class="mx-5" />
                <Avatar
                  v-else
                  src="https://i.imgur.com/WzMrY0n.png"
                  class="mx-5"
                />
                {{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Vợ/chồng (nếu có)" prop="pids">
            <Select
              v-model="formState.pids"
              filterable
              not-found-text="Không có dữ liệu"
              :clearable="true"
              placeholder="Chọn vợ/chồng"
            >
              <Option
                v-for="item in listPid"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
                <span>{{ item.id }}.</span>
                <Avatar v-if="item.img" :src="item.img" class="mx-5" />
                <Avatar
                  v-else
                  src="https://i.imgur.com/WzMrY0n.png"
                  class="mx-5"
                />
                {{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem v-if="!isUpdate" label="Vai trò" prop="isAdmin">
            <Select v-model="formState.isAdmin" placeholder="Chọn vai trò">
              <Option
                v-for="(item, index) in listRoles"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Thông tin gia đình" prop="family_info">
            <Input
              v-model="formState.family_info"
              :rows="3"
              type="textarea"
              placeholder="Nhập thông tin gia đình"
            />
          </FormItem>
          <FormItem label="Học vấn" prop="education">
            <Select
              v-model="formState.education"
              placeholder="Chọn trình độ học vấn"
            >
              <Option
                v-for="(item, index) in listEducations"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Thành tựu" prop="achievement">
            <Input
              v-model="formState.achievement"
              :rows="3"
              type="textarea"
              placeholder="Nhập thành tựu"
            />
          </FormItem>
          <FormItem label="Ảnh" prop="img">
            <div
              v-for="(item, index) in uploadList"
              :key="index"
              class="demo-upload-list"
            >
              <template v-if="item.status === 'finished'">
                <img
                  :src="item.url"
                  :style="{ fit: 'cover' }"
                  width="100%"
                  height="100%"
                />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click="handleView"></Icon>
                  <Icon
                    type="ios-trash-outline"
                    @click="handleRemove(item)"
                  ></Icon>
                </div>
              </template>
              <template v-else>
                <Progress
                  v-if="item.showProgress"
                  :percent="item.percentage"
                  hide-info
                ></Progress>
              </template>
            </div>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg', 'jpeg', 'png']"
              :max-size="5120"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              :default-file-list="defaultList"
              multiple
              type="drag"
              :action="apiUrl"
              :style="{ display: 'inline-block', width: '58px' }"
            >
              <div
                :style="{
                  width: '58px',
                  height: '58px',
                  'line-height': '58px',
                }"
              >
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
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
          </FormItem>
        </Col>
      </Row>
    </Form>

    <template #footer>
      <div class="footer-modal-create-member">
        <Button @click="handleClose">Đóng</Button>
        <Button type="primary" :loading="loading" @click="handleSubmit"
          >Xác nhận</Button
        >
      </div>
    </template>
  </Modal>
</template>

<script>
import { educations, roles } from '~/constants/dataSelect'

export default {
  name: 'CreateOrUpdateMemberModal',

  props: {
    familyTree: {
      type: Array,
      default() {
        return []
      },
    },

    isUpdate: {
      type: Boolean,
      default() {
        return false
      },
    },

    dataEdit: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      visible: false,
      loading: false,
      formState: {
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
        username: null,
        password: null,
        rePassword: null,
      },
      uploadList: [],
      defaultList: [],
      visibleImg: false,
      isCreateLogin: false,
    }
  },

  computed: {
    title() {
      return this.isUpdate ? 'Cập nhật thành viên' : 'Thêm mới thành viên'
    },

    rules() {
      return {
        name: [
          { required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' },
        ],
        gender: [
          {
            required: true,
            message: 'Vui lòng chọn giới tính',
            trigger: 'blur',
          },
        ],
        bdate: [
          {
            required: true,
            message: 'Vui lòng nhập ngày sinh',
            trigger: 'blur',
          },
        ],
        username: [
          {
            required: true,
            validator: this.checkUsername,
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            validator: this.validatePass,
            trigger: 'blur',
          },
        ],
        rePassword: [
          {
            required: true,
            validator: this.validateRePass,
            trigger: 'blur',
          },
        ],
      }
    },

    apiUrl() {
      return `${this.$nuxt.context.env.baseApiUrl}/${this.$api.UPLOAD_IMAGE}`
    },

    listFid() {
      return this.familyTree.filter((item) => item.gender === 'male')
    },

    listMid() {
      return this.familyTree.filter((item) => item.gender === 'female')
    },

    listPid() {
      return this.familyTree.filter(
        (item) =>
          item.gender !== this.formState.gender ||
          (item.id === this.formState.id && item.pids.length === 0)
      )
    },

    listEducations() {
      return educations
    },

    listRoles() {
      return roles
    },
  },

  mounted() {
    this.uploadList = this.$refs.upload.fileList
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

    async handleSubmit() {
      try {
        if (await this.$refs.form.validate()) {
          this.loading = true
          const pid = this.formState.pids ? [this.formState.pids] : []
          const method = this.isUpdate ? '$put' : '$post'
          const sourceApi = this.isUpdate
            ? `${this.$api.UPDATE_FAMILY_TREE}${this.formState.id}/`
            : this.$api.CREATE_FAMILY_TREE
          if (this.formState.generation || this.formState.generation === '') {
            delete this.formState.generation
          }
          const createUser =
            this.formState.username &&
            this.formState.password &&
            this.formState.rePassword
              ? {
                  username: this.formState.username,
                  password: this.formState.password,
                }
              : null
          await this.$axios[method](sourceApi, {
            ...this.formState,
            pids: pid,
            user: createUser,
            fid: this.formState.fid ? Number(this.formState.fid) : null,
            mid: this.formState.mid ? Number(this.formState.mid) : null,
            is_admin: this.formState.isAdmin === 'admin',
          })

          this.loading = false
          this.close()
          this.$Message.success({
            content: `${this.isUpdate ? 'Cập nhật' : 'Thêm mới'} thành công`,
            closable: true,
          })
          this.$emit('on-ok')
        }
      } catch (e) {
        this.loading = false
        console.log('error: ', e)
        if (e && e.response && e.response.status === 403) {
          this.$Message.error({
            content: 'Không được phép thực hiện hành động này',
            closable: true,
          })
        } else if (
          e &&
          e.response &&
          e.response.data &&
          e.response.data[0].includes('Tài khoản')
        ) {
          this.$Message.error({
            content: e.response.data[0],
            closable: true,
          })
        } else {
          this.$Message.error({
            content: `${this.isUpdate ? 'Cập nhật' : 'Thêm mới'} thất bại`,
            closable: true,
          })
        }
      }
    },

    validatePass(rule, value, callback) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/
      if (!value) {
        return callback(new Error('Vui lòng nhập mật khẩu'))
      } else if (!passwordRegex.test(value)) {
        return callback(
          new Error(
            'Mật khẩu phải từ 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
          )
        )
      }
      callback()
    },

    validateRePass(rule, value, callback) {
      if (!value) {
        return callback(new Error('Vui lòng nhập mật khẩu xác nhận'))
      } else if (value !== this.formState.password) {
        return callback(new Error('Mật khẩu không trùng khớp'))
      }
      callback()
    },

    checkUsername(rule, value, callback) {
      if (!value) {
        return callback(new Error('Vui lòng nhập tài khoản'))
      }
      callback()
    },

    handleView() {
      this.visibleImg = true
    },

    handleRemove(file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },

    handleSuccess(res, file) {
      // file.url = `data:image/png;base64,${res.file_data}`
      file.url = res.file
      file.name = res.file.replace(
        `${this.$nuxt.context.env.baseApiUrl}/media/images/`,
        ''
      )

      this.formState.img = file.url
      this.uploadList = this.$refs.upload.fileList
    },

    handleFormatError(file) {
      this.$Notice.warning({
        title: 'Định dạng tệp không chính xác',
        desc:
          'Định dạng của tệp ' +
          file.name +
          ' không chính xác, vui lòng chọn jpg hoặc png.',
      })
    },

    handleMaxSize(file) {
      this.$Notice.warning({
        title: 'Vượt quá giới hạn kích thước của tệp',
        desc: 'Tệp ' + file.name + ' quá lớn, không quá 5MB.',
      })
    },

    handleBeforeUpload() {
      const check = this.uploadList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: 'Chỉ được phép tải lên 1 hình ảnh',
        })
      }
      return check
    },

    handleChangeSwitch() {
      this.formState.username = ''
      this.formState.password = ''
      this.formState.rePassword = ''
    },

    setFormState(data) {
      this.formState =
        data && data.id
          ? {
              ...data,
              pids: data.pids && data.pids.length > 0 ? data.pids[0] : null,
              isAdmin: data.is_admin ? 'admin' : 'member',
              username: null,
              password: null,
              rePassword: null,
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
              username: null,
              password: null,
              rePassword: null,
            }

      this.defaultList =
        data && data.id && data.img
          ? [
              {
                name: data.name,
                url: data.img,
              },
            ]
          : []

      setTimeout(() => {
        this.uploadList = data && data.id ? this.$refs.upload.fileList : []
      }, 300)
    },

    handleChangeVisible(value) {
      if (!value) {
        this.isCreateLogin = false
        this.$refs.form.resetFields()
        this.uploadList = []
        this.$refs.upload.fileList = []
      }
    },
  },
}
</script>

<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}

.footer-modal-create-member {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
}

.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.mx-5 {
  margin: 0 5px;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.center {
  align-items: center;
}

.search-in-select {
  margin: 5px;
}

.form-create-member {
  .ivu-modal-body {
    max-height: 630px;
    overflow: auto;
  }
}
</style>
