<template>
  <div :style="{ position: 'relative', width: '100%', height: '100%' }">
    <Button
      v-if="isAdmin"
      type="success"
      class="add-member"
      @click="openModal(false)"
    >
      <Icon type="md-add" size="18" />
    </Button>

    <div id="tree" ref="tree"></div>

    <CreateOrUpdateMemberModal
      ref="refCreateOrUpdateMemberModal"
      :family-tree="nodes"
      :data-edit="dataEditSelected"
      :is-update="isUpdate"
      @on-ok="handleSuccess"
    />
    <Spin v-if="loading" size="large" fix></Spin>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FamilyTree from '@balkangraph/familytree.js'
import CreateOrUpdateMemberModal from '../CreateOrUpdateMemberModal'
import { educations } from '../../../constants/dataSelect'

export default {
  name: 'FamilyTree',

  components: {
    CreateOrUpdateMemberModal,
  },

  data() {
    return {
      loading: false,
      family: null,
      dataSelected: null,
      dataEditSelected: null,
      isUpdate: false,
      nodes: [],
    }
  },

  computed: {
    ...mapGetters(['user']),

    isAdmin() {
      return !!(this.user && this.user.is_admin)
    },

    listFid() {
      return this.nodes
        .filter((item) => item.gender === 'male')
        .map((item) => {
          return {
            value: item.id,
            text: `[${item.id}] ${item.name}`,
          }
        })
    },

    listMid() {
      return this.nodes
        .filter((item) => item.gender === 'female')
        .map((item) => {
          return {
            value: item.id,
            text: `[${item.id}] ${item.name}`,
          }
        })
    },

    listPid() {
      return this.nodes
        .filter((item) => item)
        .map((item) => {
          return {
            value: item.id,
            text: `[${item.id}] ${item.name}`,
          }
        })
    },

    listEducations() {
      return educations.map(item => {
        return {
          text: item.label,
          value: item.value
        }
      })
    }
  },

  beforeMount() {
    FamilyTree.templates.base.defs = `<g transform="matrix(0.05,0,0,0.05,-12,-9)" id="heart">
        <path fill="#aeaeae" d="M438.482,58.61c-24.7-26.549-59.311-41.655-95.573-41.711c-36.291,0.042-70.938,15.14-95.676,41.694l-8.431,8.909  l-8.431-8.909C181.284,5.762,98.663,2.728,45.832,51.815c-2.341,2.176-4.602,4.436-6.778,6.778 c-52.072,56.166-52.072,142.968,0,199.134l187.358,197.581c6.482,6.843,17.284,7.136,24.127,0.654 c0.224-0.212,0.442-0.43,0.654-0.654l187.29-197.581C490.551,201.567,490.551,114.77,438.482,58.61z"/>
        </g>
     <g transform="matrix(1,0,0,1,0,0)" id="dot"></g>
      <g id="base_node_menu" style="cursor:pointer;">
          <rect x="0" y="0" fill="transparent" width="22" height="22"></rect>
          <circle cx="4" cy="11" r="2" fill="#b1b9be"></circle>
          <circle cx="11" cy="11" r="2" fill="#b1b9be"></circle>
          <circle cx="18" cy="11" r="2" fill="#b1b9be"></circle>
      </g>
      <g style="cursor: pointer;" id="base_tree_menu">
          <rect x="0" y="0" width="25" height="25" fill="transparent"></rect>
          ${FamilyTree.icon.addUser(25, 25, '#fff', 0, 0)}
      </g>
      <g style="cursor: pointer;" id="base_tree_menu_close">
          <circle cx="12.5" cy="12.5" r="12" fill="#F57C00"></circle>
          ${FamilyTree.icon.close(25, 25, '#fff', 0, 0)}
      </g>
      <g id="base_up">
          <circle cx="115" cy="30" r="15" fill="#fff" stroke="#b1b9be" stroke-width="1"></circle>
          ${FamilyTree.icon.ft(20, 80, '#b1b9be', 105, -10)}
      </g>
      <clipPath id="base_img_0">
        <circle id="base_img_0_stroke" cx="45" cy="62" r="35"/>
      </clipPath>
      <clipPath id="base_img_1">
        <circle id="base_img_1_stroke" cx="100" cy="62" r="35"/>
      </clipPath>
      `

    FamilyTree.templates.main = Object.assign({}, FamilyTree.templates.base)
    FamilyTree.templates.main.defs = `<style>
                                        .{randId} .bft-edit-form-header, .{randId} .bft-img-button{
                                            background-color: #aeaeae;
                                        }
                                        .{randId}.male .bft-edit-form-header, .{randId}.male .bft-img-button{
                                            background-color: #6bb4df;
                                        }
                                        .{randId}.male div.bft-img-button:hover{
                                            background-color: #cb4aaf;
                                        }
                                        .{randId}.female .bft-edit-form-header, .{randId}.female .bft-img-button{
                                            background-color: #cb4aaf;
                                        }
                                        .{randId}.female div.bft-img-button:hover{
                                            background-color: #6bb4df;
                                        }
    </style>`
    FamilyTree.templates.main.node =
      '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#ccc" rx="5" ry="5"></rect>'
    // +
    // '<rect x="0" y="0" height="20" width="{w}" fill="#b1b9be" stroke-width="1" stroke="#b1b9be" rx="5" ry="5"></rect>' +
    // '<line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="#b1b9be"></line>'

    FamilyTree.templates.main.field_0 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="250" style="font-size: 14px;" font-variant="all-small-caps" fill="white" x="125" y="16" text-anchor="middle">{val}</text>'
    FamilyTree.templates.main.field_1 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="160" data-text-overflow="multiline" style="font-size: 14px;" fill="black" x="100" y="66" text-anchor="start">{val}</text>'
    FamilyTree.templates.main.field_2 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 10px;" fill="#b1b9be" x="100" y="95" text-anchor="start">{val}</text>'
    FamilyTree.templates.main.field_3 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="60" style="font-size: 12px;" fill="black" x="47" y="112" text-anchor="middle">{val}</text>'
    FamilyTree.templates.main.img_0 = `<use xlink:href="#base_img_0_stroke" />
       <circle id="base_img_0_stroke" fill="#b1b9be" cx="45" cy="62" r="37"/>
      <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}" x="10" y="26" width="72" height="72"></image>`
    FamilyTree.templates.main_male = Object.assign(
      {},
      FamilyTree.templates.main
    )
    FamilyTree.templates.main_male.node =
      '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#6bb4df" rx="5" ry="5"></rect>'
    // +
    // '<rect x="0" y="0" height="20" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#6bb4df" rx="5" ry="5"></rect>' +
    // '<line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="#6bb4df"></line>'
    FamilyTree.templates.main_male.img_0 = `<use xlink:href="#base_img_0_stroke" />
       <circle id="base_img_0_stroke" fill="#6bb4df" cx="45" cy="62" r="37"/>
      <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}" x="10" y="26" width="72" height="72"></image>`
    FamilyTree.templates.main_male_child = Object.assign(
      {},
      FamilyTree.templates.main_male
    )
    FamilyTree.templates.main_male_child.link =
      '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="2px" fill="none" d="{rounded}" />'

    FamilyTree.templates.main_female = Object.assign(
      {},
      FamilyTree.templates.main_male
    )
    FamilyTree.templates.main_female.node =
      '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#cb4aaf" rx="5" ry="5"></rect>'
    // +
    // '<rect x="0" y="0" height="20" width="{w}" fill="#cb4aaf" stroke-width="1" stroke="#cb4aaf" rx="5" ry="5"></rect>' +
    // '<line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="#cb4aaf"></line>'
    FamilyTree.templates.main_female.img_0 = `<use xlink:href="#base_img_0_stroke" />
       <circle id="base_img_0_stroke" fill="#cb4aaf" cx="45" cy="62" r="37"/>
      <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}" x="10" y="26" width="72" height="72"></image>`
    FamilyTree.templates.main_female_child = Object.assign(
      {},
      FamilyTree.templates.main_female
    )
    FamilyTree.templates.main_female_child.link =
      '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="2px" fill="none" d="{rounded}" />'

    FamilyTree.templates.single = Object.assign({}, FamilyTree.templates.tommy)
    FamilyTree.templates.single.size = [200, 200]
    FamilyTree.templates.single.defs = `<style>
                                        .{randId} .bft-edit-form-header, .{randId} .bft-img-button{
                                            background-color: #aeaeae;
                                        }
                                        .{randId}.male .bft-edit-form-header, .{randId}.male .bft-img-button{
                                            background-color: #6bb4df;
                                        }
                                        .{randId}.male div.bft-img-button:hover{
                                            background-color: #cb4aaf;
                                        }
                                        .{randId}.female .bft-edit-form-header, .{randId}.female .bft-img-button{
                                            background-color: #cb4aaf;
                                        }
                                        .{randId}.female div.bft-img-button:hover{
                                            background-color: #6bb4df;
                                        }
    </style>`
    FamilyTree.templates.single.node =
      '<circle cx="100" cy="100" r="100" fill="white" stroke-width="1" stroke="#aeaeae"></circle>'
    // FamilyTree.templates.single.field_0 =
    //   '<text ' +
    //   FamilyTree.attr.width +
    //   ' ="160" style="font-size: 14px;" font-variant="all-small-caps"  font-weight="bold" fill="black" x="100" y="115" text-anchor="middle">{val}</text>'
    FamilyTree.templates.single.field_1 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="190" data-text-overflow="multiline" style="font-size: 16px;" fill="black" x="100" y="135" text-anchor="middle">{val}</text>'
    FamilyTree.templates.single.field_2 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 10px;" fill="#b1b9be" x="100" y="95" text-anchor="start">{val}</text>'
    FamilyTree.templates.single.field_3 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="60" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>'
    FamilyTree.templates.single.nodeMenuButton = `<use ${FamilyTree.attr.control_node_menu_id}="{id}" x="89" y="5" xlink:href="#base_node_menu" />`
    FamilyTree.templates.single_male = Object.assign(
      {},
      FamilyTree.templates.single
    )
    FamilyTree.templates.single_male.node =
      '<circle cx="100" cy="100" r="100" fill="white" stroke-width="3" stroke="#6bb4df" ></circle>'
    FamilyTree.templates.single_male.field_2 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 10px;" fill="#b1b9be" x="100" y="95" text-anchor="start">{val}</text>'
    FamilyTree.templates.single_male.img_0 = `<use xlink:href="#base_img_1_stroke"/>
       <circle id="base_img_1_stroke" fill="#6bb4df" cx="100" cy="62" r="37"/>
      <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_1)" xlink:href="{val}" x="65" y="26" width="72" height="72"></image>`
    FamilyTree.templates.single_female = Object.assign(
      {},
      FamilyTree.templates.single_male
    )
    FamilyTree.templates.single_female.node =
      '<circle cx="100" cy="100" r="100" fill="white" stroke-width="3" stroke="#cb4aaf" ></circle>'
    FamilyTree.templates.single_female.field_2 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 10px;" fill="#b1b9be" x="100" y="95" text-anchor="start">{val}</text>'
    FamilyTree.templates.single_female.img_0 = `<use xlink:href="#base_img_1_stroke"/>
       <circle id="base_img_1_stroke" fill="#cb4aaf" cx="100" cy="62" r="37"/>
      <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_1)" xlink:href="{val}" x="65" y="26" width="72" height="72"></image>`

    FamilyTree.templates.family_single_male = Object.assign(
      {},
      FamilyTree.templates.single_male
    )
    FamilyTree.templates.family_single_male.link =
      '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="2px" fill="none" d="{rounded}" />'
    FamilyTree.templates.family_single_male.field_2 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 10px;" fill="#b1b9be" x="70" y="160" text-anchor="start">{val}</text>'
    FamilyTree.templates.family_single_female = Object.assign(
      {},
      FamilyTree.templates.single_female
    )
    FamilyTree.templates.family_single_female.link =
      '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="2px" fill="none" d="{rounded}" />'
    FamilyTree.templates.family_single_female.field_2 =
      '<text ' +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 10px;" fill="#b1b9be" x="70" y="160" text-anchor="start">{val}</text>'
  },

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      try {
        this.loading = true
        const res = await this.$axios.$get(this.$api.GET_FAMILY_TREE, {
          params: {
            query_all: true,
          },
        })
        this.nodes = res.map((item) => {
          return {
            ...item,
            img: item.img
              ? item.img
              : 'http://localhost:8000/media/images/no-avt.png',
            tags:
              !item.pids || item.pids.length === 0
                ? item.gender === 'male'
                  ? ['family_single_male']
                  : ['family_single_female']
                : ['main'],
          }
        })
        this.loading = false

        this.myTree(this.$refs.tree, this.nodes)
      } catch (e) {
        console.log('error: ', e)
        this.loading = false
      }
    },

    myTree(domEl, x) {
      FamilyTree.SEARCH_PLACEHOLDER = 'Tìm kiếm thành viến'

      this.family = new FamilyTree(domEl, {
        // template: 'john',
        template: 'main',
        toolbar: {
          fullScreen: true,
        },
        siblingSeparation: 120,
        scaleInitial: FamilyTree.match.boundary,
        // mouseScrool: FamilyTree.action.none,
        nodeMenu: this.isAdmin
          ? {
              details: { text: 'Chi tiết' },
              edit: { text: 'Chỉnh sửa' },
              remove: { text: 'Xóa' },
            }
          : {
              details: { text: 'Chi tiết' },
            },
        nodeBinding: {
          field_0: 'generation',
          field_1: 'name',
          field_2: 'bdate',
          field_3: 'id',
          img_0: 'img',
        },
        editForm: {
          readOnly: !this.isAdmin,
          buttons: {
            edit: {
              icon: FamilyTree.icon.edit(24, 24, '#fff'),
              text: 'Edit',
            },
            share: {
              icon: FamilyTree.icon.share(24, 24, '#fff'),
              text: 'Share',
            },
            pdf: {
              icon: FamilyTree.icon.pdf(24, 24, '#fff'),
              text: 'Save as PDF',
            },
            remove: {
              icon: FamilyTree.icon.remove(24, 24, '#fff'),
              text: 'Remove',
              hideIfEditMode: true,
              hideIfDetailsMode: !this.isAdmin,
            },
          },
          generateElementsFromFields: false,
          elements: [
            {
              type: 'textbox',
              label: 'Thế hệ',
              binding: 'generation',
            },
            {
              type: 'textbox',
              label: 'Họ tên',
              binding: 'name',
              vlidators: { required: 'Không được để trống' },
            },
            [
              {
                type: 'date',
                label: 'Ngày sinh',
                binding: 'bdate',
                vlidators: { required: 'Không được để trống' },
              },
              { type: 'date', label: 'Ngày mất', binding: 'ddate' },
            ],
            [
              {
                type: 'textbox',
                label: 'Link ảnh',
                binding: 'img',
                btn: 'Upload',
              },
              {
                type: 'select',
                options: [
                  { value: 'male', text: 'Nam' },
                  { value: 'female', text: 'Nữ' },
                ],
                label: 'Giới tính',
                binding: 'gender',
              },
            ],
            {
              type: 'select',
              options: [{ value: '', text: '' }, ...this.listFid],
              label: 'Cha',
              binding: 'fid',
            },
            {
              type: 'select',
              options: [{ value: '', text: '' }, ...this.listMid],
              label: 'Mẹ',
              binding: 'mid',
            },
            {
              type: 'select',
              options: [{ value: '', text: '' }, ...this.listPid],
              label: 'Vợ/chồng',
              binding: 'pids',
            },
            { type: 'textbox', label: 'Email', binding: 'email' },
            { type: 'textbox', label: 'Số điện thoại', binding: 'phone' },
            { type: 'textbox', label: 'Địa chỉ', binding: 'address' },
            {
              type: 'textbox',
              label: 'Thông tin gia đình',
              binding: 'family_info',
            },
            {
              type: 'textbox',
              label: 'Thành tựu',
              binding: 'achievement',
            },
            {
              type: 'select',
              options: [...this.listEducations],
              label: 'Học vấn',
              binding: 'education',
            },
          ],
          addMore: null,
          addMoreBtn: null,
          addMoreFieldName: null,
          cancelBtn: 'Đóng',
          saveAndCloseBtn: 'Lưu và thoát',
        },
        orderBy: 'orderId',
        tags: {
          single_male: {
            template: 'single_male',
          },
          single_female: {
            template: 'single_female',
          },
          main_female_child: {
            template: 'main_female_child',
          },
          main_male_child: {
            template: 'main_male_child',
          },
          family_single_female: {
            template: 'family_single_female',
          },
          family_single_male: {
            template: 'family_single_male',
          },
        },
      })

      this.family.on('render-link', (sender, args) => {
        if (args.cnode.ppid !== undefined) {
          args.html +=
            '<use xlink:href="#heart" x="' +
            args.p.xa +
            '" y="' +
            args.p.ya +
            '"/>'
        }
      })

      this.family.on('field', (sender, args) => {
        if (args.name === 'bdate') {
          const bdate = args.data.bdate

          if (args.data.ddate) {
            const ddate = args.data.ddate
            args.value = bdate.split('-')[0] + ' - ' + ddate.split('-')[0]
          } else args.value = bdate.split('-')[0]
        }
      })

      // this.family.editUI.on('show', (sender, args) => {
      //   const generation = this.nodes.find(
      //     (item) => item.id === args
      //   ).generation
      //   this.dataSelected = args
      //   setTimeout(() => {
      //     const node = `<div class="bft-form-field" style="min-width: 280px;">
      //                       <div class="bft-input">
      //                         <label for="_cav2" class="hasval">Thế hệ</label>
      //                         <input type="text" readonly="true" value="${generation}" style="border: none; background: none">
      //                   </div>
      //                 </div>`
      //
      //     const bftForm =
      //       node +
      //       document.getElementsByClassName('bft-form-fieldset')[0].innerHTML
      //
      //     document.getElementsByClassName('bft-form-fieldset')[0].innerHTML =
      //       bftForm
      //   }, 0)
      // })

      this.family.editUI.on('element-btn-click', (sender, args) => {
        FamilyTree.fileUploadDialog((file) => {
          const formData = new FormData()
          formData.append('file', file)

          const requestOptions = {
            method: 'POST',
            body: formData,
          }

          fetch(
            `${this.$nuxt.context.env.baseApiUrl}/${this.$api.UPLOAD_IMAGE}`,
            requestOptions
          )
            .then((response) => response.json())
            .then((result) => {
              args.input.value = result.file
            })
            .catch((error) => console.log('error', error))
        })
      })

      this.family.editUI.on('button-click', (sender, args) => {
        if (args.name === 'edit') {
          this.dataEditSelected = this.nodes.find(item => item.id === args.nodeId)
          setTimeout(() => {
            this.family.editUI.hide()
            this.openModal(true)
          })
        }
      })

      this.family.editUI.on('save', async (sender, args) => {
        const data = { ...args.data }
        const pid = data && data.pids ? [Number(data.pids)] : []

        if (data.id) delete data.id
        if (data.fid === '') delete data.fid
        if (data.mid === '') delete data.mid
        if (data.bdate === '') delete data.bdate
        if (data.ddate === '') delete data.ddate
        if (data.tags) delete data.tags
        if (data.generation) delete data.generation

        try {
          await this.$axios.$put(
            `${this.$api.UPDATE_FAMILY_TREE}${args.data.id}/`,
            {
              ...data,
              fid: data.fid ? Number(data.fid) : null,
              mid: data.mid ? Number(data.mid) : null,
              pids: pid,
            }
          )
          this.$Message.success({
            content: 'Cập nhật thành công',
            closable: true,
          })
          this.getData()
        } catch (e) {
          console.log('error', e)
          if (e && e.response && e.response.status === 403) {
            this.$Message.error({
              content: 'Không được phép thực hiện hành động này',
              closable: true,
            })
          } else {
            this.$Message.error({
              content: 'Cập nhật thất bại',
              closable: true,
            })
          }
          this.getData()
        }
      })

      this.family.onUpdateNode(async (args) => {
        if (args.removeNodeId) {
          try {
            this.loading = true
            await this.$axios.$delete(
              `${this.$api.DELETE_FAMILY_TREE}${args.removeNodeId}/`
            )
            this.loading = false
            this.$Message.success({
              content: 'Xóa thành thành công',
              closable: true,
            })
            this.getData()
          } catch (e) {
            console.log('error', e)
            this.loading = false
            if (e && e.response && e.response.status === 403) {
              this.$Message.error({
                content: 'Không được phép thực hiện hành động này',
                closable: true,
              })
            } else {
              this.$Message.error({
                content: 'Xóa thất thất bại',
                closable: true,
              })
            }
            this.getData()
          }
        }
      })

      this.family.on('removed', async (sender, args) => {
        if (args) {
          try {
            this.loading = true
            await this.$axios.$delete(`${this.$api.DELETE_FAMILY_TREE}${args}/`)
            this.loading = false
            this.$Message.success({
              content: 'Xóa thành thành công',
              closable: true,
            })
            this.getData()
          } catch (e) {
            console.log('error', e)
            this.loading = false
            if (e && e.response && e.response.status === 403) {
              this.$Message.error({
                content: 'Không được phép thực hiện hành động này',
                closable: true,
              })
            } else {
              this.$Message.error({
                content: 'Xóa thất thất bại',
                closable: true,
              })
            }
            this.getData()
          }
        }
      })

      this.family.load(x)
    },

    openModal(update) {
      this.isUpdate = update

      this.$refs.refCreateOrUpdateMemberModal.open()
      this.$refs.refCreateOrUpdateMemberModal.setFormState({
        ...this.dataEditSelected
      })

      this.dataEditSelected = null
    },

    handleSuccess() {
      this.getData()
    },
  },
}
</script>
<style lang="less">
#tree {
  width: 100%;
  height: 100%;
}

.mini-map {
  bottom: 45px !important;
}

.add-member {
  position: absolute;
  padding: 0 10px;
  top: 22px;
  left: 22px;
  z-index: 2;
}
</style>
