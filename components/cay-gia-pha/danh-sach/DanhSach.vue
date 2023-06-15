<template>
  <div class="list-family-tree">
    <div class="header-table-family-tree">
      <div>
        <span class="mr-5">Tìm kiếm</span>
        <Input
          v-model="searchValue"
          search
          clearable
          placeholder="Nhập nội dung tìm kiếm"
          class="input-search"
          @on-clear="handleSearch"
          @on-search="handleSearch"
        />
      </div>
      <Button v-if="isAdmin" type="success" @click="openModal(false)">
        <Icon type="md-add" size="18"/>
        Thêm mới
      </Button>
    </div>

    <div class="flex-1">
      <Table
        size="large"
        max-height="650"
        :columns="columns"
        :data="data"
        :loading="loading"
      >
        <template slot="name" slot-scope="{ row }">
          <Avatar v-if="row.img" :src="row.img"/>
          <Avatar v-else src="http://localhost:8000/media/images/no-avt.png"/>
          <span class="ml-10">{{ row.name }}</span>
        </template>
        <template slot="gender" slot-scope="{ row }">
          <span>{{ gender(row.gender) }}</span>
        </template>
        <template slot="bdate" slot-scope="{ row }">
          <span>{{ format(row.bdate) }}</span>
        </template>
        <template slot="ddate" slot-scope="{ row }">
          <span>{{ format(row.ddate) }}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <Icon
            type="md-eye"
            size="20"
            color="#808695"
            class="mr-5 cursor"
            @click="show(row)"
          />
          <Icon
            v-if="isAdmin"
            type="md-create"
            size="20"
            color="#2d8cf0"
            class="mr-5 cursor"
            @click="edit(row)"
          />
          <Icon
            v-if="isAdmin"
            type="md-trash"
            size="20"
            color="#ed4014"
            class="cursor"
            @click="remove(row)"
          />
        </template>
      </Table>
    </div>

    <div class="custom-navigate">
      <span class="mr-10">Tổng: {{ total }}</span>
      <Page
        :current="+query.page"
        :page-size="query.pageSize"
        :total="total"
        @on-change="handleChangePage"
      />
    </div>

    <DetailMemberModal ref="refDetailMemberModal" :family-tree="allData"/>

    <CreateOrUpdateMemberModal
      ref="refCreateOrUpdateMemberModal"
      :family-tree="allData"
      :data-edit="dataSelected"
      :is-update="isUpdate"
      @on-ok="handleSuccess"
    />

    <ConfirmModal
      ref="refConfirmModal"
      title="Xác nhận xoá"
      text="Hành động này sẽ xóa thành viên này. Bạn đồng ý thực hiện?"
      @on-ok="deleteMember"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import DetailMemberModal from '../DetailMemberModal'
  import CreateOrUpdateMemberModal from '../CreateOrUpdateMemberModal'
  import ConfirmModal from '../../base/ConfirmModal'
  import { mappingGender } from '~/constants/mapping'
  import { formatDate } from '~/utils/dateFormatter'

  export default {
    name: 'DanhSach',

    components: {
      CreateOrUpdateMemberModal,
      ConfirmModal,
      DetailMemberModal
    },

    data() {
      return {
        isUpdate: false,
        loading: false,
        data: [],
        allData: [],
        dataSelected: null,
        query: {
          page: 1,
          pageSize: 10
        },
        total: 0,
        searchValue: '',
        idDelete: null
      }
    },

    computed: {
      ...mapGetters(['user']),

      isAdmin() {
        return !!(this.user && this.user.is_admin)
      },

      listGeneration() {
        const result = this.allData && this.allData.length > 0 ? [...new Set(this.allData.map(item => item.generation))] : []
        return this.allData && this.allData.length > 0 ? result.map(item => {
          return {
            value: item,
            label: item
          }
        }) : []
      },

      columns() {
        return [
          {
            title: 'UID',
            key: 'id',
            width: '70px'
          },
          {
            title: 'Họ tên',
            key: 'name',
            slot: 'name'
          },
          {
            title: 'Giới tính',
            slot: 'gender',
            width: '150px',
            filters: [
              {
                value: 'male',
                label: 'Nam'
              },
              {
                value: 'female',
                label: 'Nữ'
              }
            ],
            filterMultiple: false,
            filterRemote: value => this.handleFilter('gender', value)
          },
          {
            title: 'Ngày sinh',
            key: 'bdate',
            slot: 'bdate'
          },
          {
            title: 'Ngày mất',
            key: 'ddate',
            slot: 'ddate'
          },
          {
            title: 'Thế hệ',
            key: 'generation',
            width: '110px',
            filters: this.listGeneration,
            filterMultiple: false,
            filterRemote: value => this.handleFilter('generation', value)
          },
          {
            title: 'Hành động',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ]
      }
    },

    watch: {
      $route: {
        immediate: true,
        deep: true,
        handler() {
          this.getData()
        }
      }
    },

    created() {
      this.getAllData()

      if (this.$route.query && this.$route.query.search)
        this.searchValue = this.$route.query.search
      if (this.$route.query && this.$route.query.page)
        this.query.page = this.$route.query.page
    },

    methods: {
      async getData() {
        try {
          const query = {
            ...this.query,
            ...this.$route.query
          }
          this.loading = true
          const res = await this.$axios.$get(this.$api.GET_FAMILY_TREE, {
            params: {
              ...query,
              ordering: '-id'
            }
          })
          this.data = res.results.map((item, index) => {
            return {
              ...item,
              stt: index + 1 + 10 * (this.query.page - 1)
            }
          })
          this.total = res.count
          this.loading = false
        } catch (e) {
          console.log('error: ', e)
          this.loading = false
        }
      },

      async getAllData() {
        try {
          const res = await this.$axios.$get(this.$api.GET_FAMILY_TREE, {
            params: {
              query_all: true
            }
          })
          this.allData = res
        } catch (e) {
          console.log('error: ', e)
        }
      },

      handleChangePage(page) {
        this.query.page = page
        const query = {
          ...this.$route.query,
          page
        }

        this.$router.push({
          query: {
            ...query
          }
        })
      },

      handleSearch() {
        const query = {
          ...this.$route.query,
          search: this.searchValue
        }

        this.query.page = 1
        if (query.page) delete query.page
        if (query.search === '') delete query.search

        this.$router.push({
          query: {
            ...query
          }
        })
      },

      handleFilter(type, value) {
        const query = {
          ...this.$route.query
        }

        if (type === 'generation') {
          if (value.length > 0) {
            query.generation = value[0]
          } else {
            delete query.generation
          }
        }

        if (type === 'gender') {
          if (value.length > 0) {
            query.gender = value[0]
          } else {
            delete query.gender
          }
        }

        delete query.page
        this.query.page = 1

        this.$router.push({
          query
        })
      },

      show(row) {
        this.dataSelected = row
        this.$refs.refDetailMemberModal.open()
        this.$refs.refDetailMemberModal.setFormState({ ...row })
      },

      edit(row) {
        this.dataSelected = row
        this.openModal(true)
      },

      remove(row) {
        this.idDelete = row.id
        this.$refs.refConfirmModal.open()
      },

      gender(value) {
        return value ? mappingGender[value] : '-'
      },

      openModal(update) {
        this.isUpdate = update

        this.$refs.refCreateOrUpdateMemberModal.open()
        this.$refs.refCreateOrUpdateMemberModal.setFormState({
          ...this.dataSelected
        })

        this.dataSelected = null
      },

      format(date) {
        return date ? formatDate(date) : '-'
      },

      handleSuccess() {
        this.getData()
        this.getAllData()
      },

      async deleteMember() {
        try {
          this.loading = true
          await this.$axios.$delete(
            `${this.$api.DELETE_FAMILY_TREE}${this.idDelete}/`
          )
          this.$Message.success({
            content: 'Xóa thành thành công',
            closable: true
          })
          this.handleSuccess()
        } catch (e) {
          console.log('error', e)
          this.loading = false
          if (e && e.response && e.response.status === 403) {
            this.$Message.error({
              content: 'Không được phép thực hiện hành động này',
              closable: true
            })
          } else {
            this.$Message.error({
              content: 'Xóa thất thất bại',
              closable: true
            })
          }
        }
      }
    }
  }
</script>
<style lang="less">
  .list-family-tree {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .custom-navigate {
      display: flex;
      align-items: center;
      justify-content: end;
      margin-top: 20px;
    }
  }

  .flex-1 {
    flex: 1;
  }

  .ml-10 {
    margin-left: 10px;
  }

  .mr-10 {
    margin-right: 10px;
  }

  .mr-5 {
    margin-right: 5px;
  }

  .cursor {
    cursor: pointer;
  }

  .header-table-family-tree {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .input-search {
      /*min-width: 150px;*/
      /*max-width: 300px;*/
      width: 200px;
    }
  }
</style>
