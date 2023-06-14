<template>
  <div class="list-thu">
    <Tabs :value="tabSelected" :animated="false" @on-click="handleClickTab">
      <TabPane label="Thu" name="thu"></TabPane>
      <TabPane label="Tài trợ" name="tai-tro"></TabPane>
      <TabPane label="Thiết lập mức thu" name="muc-thu"></TabPane>
    </Tabs>
    <div class="header-table">
      <div :style="{ display: 'flex', gap: '10px' }">
        <div >
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
        <div>
          <span>Thời gian</span>
          <DatePicker :value="timeRange"
                      format="dd/MM/yyyy"
                      type="daterange"
                      placement="bottom-end"
                      placeholder="Bắt đầu - Kết thúc"
                      :style="{ width: '200px' }"
                      @on-change="handleChangeTime"></DatePicker>
        </div>
      </div>
      <Button v-if="isAdmin" type="success" @click="openModal(false)">
        <Icon type="md-add" size="18"/>
        Thêm mới
      </Button>
    </div>

    <div class="flex-1">
      <Table
        size="large"
        max-height="600"
        :columns="columns"
        :data="data"
        :loading="loading"
      >
        <template slot="name" slot-scope="{ row }">
          <div v-if="row && row.member">
            <Avatar v-if="row.member.img" :src="row.member.img"/>
            <Avatar
              v-else
              src="http://localhost:8000/media/images/no-avt.png"
            />
            <span class="ml-10">{{ row.member.name }}</span>
          </div>
          <div v-else>-</div>
        </template>
        <template slot="year_contributor" slot-scope="{ row }">
          <span>{{ row && row.contributor ? row.contributor.year : '-' }}</span>
        </template>
        <template slot="date" slot-scope="{ row }">
          <span>{{ format(row) }}</span>
        </template>
        <template slot="amount" slot-scope="{ row }">
          <span>{{ parseAmount(row) }}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
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

    <CreateOrUpdateModal
      ref="refCreateOrUpdateModal"
      :data-member="dataMember"
      :data-sponsor="dataSponsor"
      :data-contribution-level="dataContributionLevel"
      :data-edit="dataSelected"
      :is-update="isUpdate"
      @on-ok="handleSuccess"
    />

    <ConfirmModal
      ref="refConfirmModal"
      title="Xác nhận xoá"
      text="Hành động này sẽ xóa mức thu này. Bạn đồng ý thực hiện?"
      @on-ok="deleteDanhSachThu"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { formatDate, convertDateFormat} from '../../../utils/dateFormatter'
  import ConfirmModal from '../../base/ConfirmModal'
  import CreateOrUpdateModal from './CreateOrUpdateModal'

  export default {
    name: 'DanhSach',

    components: {
      CreateOrUpdateModal,
      ConfirmModal
    },

    data() {
      return {
        isUpdate: false,
        loading: false,
        data: [],
        dataContributionLevel: [],
        dataSponsor: [],
        dataMember: [],
        dataSelected: {},
        query: {
          page: 1,
          pageSize: 10
        },
        total: 0,
        searchValue: '',
        timeRange: [],
        idDelete: null,
        tabSelected: 'thu'
      }
    },

    computed: {
      ...mapGetters(['user']),

      isAdmin() {
        return !!(this.user && this.user.is_admin)
      },

      listContributor() {
        return this.dataContributionLevel.map(item => {
          return {
            value: item.year,
            label: item.year
          }
        })
      },

      columns() {
        return [
          {
            title: 'STT',
            key: 'stt',
            width: '70px'
          },
          {
            title: 'Thành viên',
            slot: 'name'
          },
          {
            title: 'Mức thu',
            slot: 'year_contributor',
            filters: this.listContributor,
            filterMultiple: false,
            filterRemote: value => this.handleFilter('contributor__year', value)
          },
          {
            title: 'Số tiền (VNĐ)',
            slot: 'amount'
          },
          {
            title: 'Ngày thu',
            slot: 'date',
            width: '150px'
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
      this.getDataMember()
      this.getDataContributionLevel()
      if (this.$route.query && this.$route.query.search) {
        this.searchValue = this.$route.query.search
      }
      if (this.$route.query && this.$route.query.page) {
        this.query.page = this.$route.query.page
      }
      if (this.$route.query && this.$route.query.date_before && this.$route.query.date_after) {
        this.timeRange = [formatDate(this.$route.query.date_before), formatDate(this.$route.query.date_after)]
      }
    },

    methods: {
      async getDataMember() {
        try {
          this.loading = true
          const res = await this.$axios.$get(this.$api.GET_FAMILY_TREE, {
            params: {
              query_all: true
            }
          })
          this.dataMember = res
        } catch (e) {
          console.log('error: ', e)
        }
      },

      async getDataContributionLevel() {
        try {
          this.loading = true
          const res = await this.$axios.$get(this.$api.CONTRIBUTION, {
            params: {
              query_all: true
            }
          })
          this.dataContributionLevel = res
        } catch (e) {
          console.log('error: ', e)
        }
      },

      async getData() {
        try {
          const query = {
            ...this.query,
            ...this.$route.query
          }
          this.loading = true
          const res = await this.$axios.$get(this.$api.INCOMES, {
            params: {
              ...query,
              ordering: '-id',
              contributor__isnull: false
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

      handleChangeTime(value) {
        const query = {
          ...this.$route.query,
          date_before: convertDateFormat(value[0]),
          date_after: convertDateFormat(value[1])
        }

        this.query.page = 1
        if (query.page) delete query.page
        if (query.date_before === '') delete query.date_before
        if (query.date_after === '') delete query.date_after

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

        if (type === 'contributor__year') {
          if (value.length > 0) {
            query.contributor__year = value[0]
          } else {
            delete query.contributor__year
          }
        }

        delete query.page
        this.query.page = 1

        this.$router.push({
          query
        })
      },

      edit(row) {
        this.dataSelected = row
        this.openModal(true)
      },

      remove(row) {
        this.idDelete = row.id
        this.$refs.refConfirmModal.open()
      },

      openModal(update) {
        this.isUpdate = update

        this.$refs.refCreateOrUpdateModal.open()
        this.$refs.refCreateOrUpdateModal.type =
          this.dataSelected.member || !update ? 'Thu định kỳ' : 'Tài trợ'
        this.$refs.refCreateOrUpdateModal.setFormState({
          id: this.dataSelected.id,
          date: this.dataSelected.date,
          member: this.dataSelected.member ? this.dataSelected.member.id : null,
          sponsor: this.dataSelected.sponsor
            ? this.dataSelected.sponsor.id
            : null,
          contributor: this.dataSelected.contributor
            ? this.dataSelected.contributor.id
            : null
        })

        this.dataSelected = {}
      },

      handleSuccess() {
        this.getData()
      },

      format(row) {
        if (row && row.date) {
          return formatDate(row && row.date)
        }
        return '-'
      },

      parseAmount(row) {
        if (row && row.contributor) {
          return `${Number(row.contributor.amount)}`.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ','
          )
        } else if (row && row.sponsor) {
          return `${Number(row.sponsor.amount)}`.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ','
          )
        }
        return '-'
      },

      async deleteDanhSachThu() {
        try {
          this.loading = true
          await this.$axios.$delete(`${this.$api.INCOMES}${this.idDelete}/`)
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
      },

      handleClickTab(value) {
        if (value === 'thu') this.$router.push('/tai-chinh/thu')
        else if (value === 'tai-tro') this.$router.push('/tai-chinh/tai-tro')
        else if (value === 'muc-thu') this.$router.push('/tai-chinh/muc-thu')
      },
    }
  }
</script>
<style lang="less">
  .list-thu {
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

  .header-table {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .input-search {
      /*flex: 1;*/
      /*min-width: 150px;*/
      /*max-width: 300px;*/
      width: 200px;
    }
  }
</style>
