<template>
  <Modal
    v-model="visible"
    :title="title"
    width="500"
    class-name="vertical-center-modal form-create-muc-thu"
    @on-visible-change="handleChangeVisible"
  >
    <Form
      ref="form"
      label-position="left"
      :model="formState"
      :rules="rules"
      :label-width="130"
    >
      <FormItem label="Năm" prop="year">
        <Select
          v-model="formState.year"
          filterable
          placeholder="Chọn năm"
          :style="{ width: '100px' }"
        >
          <Option
            v-for="(item, index) in listYears"
            :key="index"
            :value="item.value"
            :label="item.label"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem label="Mức thu" prop="amount">
        <InputNumber
          v-model="formState.amount"
          :min="0"
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
          placeholder="Nhập mức thu"
          :style="{ width: '150px' }"
        ></InputNumber>
      </FormItem>
      <FormItem label="Ghi chú" prop="note">
        <Input
          v-model="formState.note"
          :rows="3"
          type="textarea"
          placeholder="Nhập ghi chú"
        ></Input>
      </FormItem>
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
import { years } from '../../../constants/dataSelect'

export default {
  props: {
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
        note: '',
        amount: 0,
        year: null,
      },
    }
  },

  computed: {
    title() {
      return this.isUpdate ? 'Cập nhật mức thu' : 'Thêm mới mức thu'
    },

    rules() {
      return {
        amount: [
          { required: true, validator: this.validateAmout, trigger: 'blur' },
        ],
        year: [
          { required: true, validator: this.validateYear, trigger: 'blur' },
        ],
      }
    },

    listYears() {
      return years()
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

    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        try {
          if (valid) {
            this.loading = true
            const method = this.isUpdate ? '$put' : '$post'
            const sourceApi = this.isUpdate
              ? `${this.$api.CONTRIBUTION}${this.formState.id}/`
              : this.$api.CONTRIBUTION
            await this.$axios[method](sourceApi, {
              ...this.formState,
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
            e.response.data.year
          ) {
            console.log(e.response)
            this.$Message.error({
              content: `Mức thu với năm ${this.formState.year} đã tồn tại`,
              closable: true,
            })
          } else {
            this.$Message.error({
              content: `${this.isUpdate ? 'Cập nhật' : 'Thêm mới'} thất bại`,
              closable: true,
            })
          }
        }
      })
    },

    setFormState(data) {
      this.formState =
        data && data.id
          ? {
              ...data,
            }
          : {
              note: '',
              amount: 0,
              year: null,
            }
    },

    handleChangeVisible(value) {
      if (!value) {
        this.$refs.form.resetFields()
      }
    },

    validateAmout(rule, value, callback) {
      if (!value) {
        return callback(new Error('Vui lòng nhập mức thu'))
      }
      callback()
    },

    validateYear(rule, value, callback) {
      if (!value) {
        return callback(new Error('Vui lòng chọn năm'))
      }
      callback()
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

.form-create-muc-thu {
  .ivu-modal-body {
    height: 300px;
    overflow: auto;
  }
}
</style>
