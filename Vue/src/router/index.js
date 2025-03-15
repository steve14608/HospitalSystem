import { createRouter, createWebHistory } from 'vue-router'
import Layout from "../views/Layout/index.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Layout",
      component: Layout,
      hidn: true
    },
    {
      path: "/login",
      name: "登录",
      component: () => import('../views/Layout/login.vue'),
      hidn: true
    },
    {
      path: '/',
      name: '挂号收费',
      component: Layout,
      iconCls: "document",
      meta: {
        type: "财务"
      },
      children: [
        {
          path: '/onsite_registration',
          name: '窗口挂号',
          component: () => import('../views/registration/onsite_registratiion.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/registration_record',
          name: '窗口退号',
          component: () => import('../views/registration/registration_record.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/expense_charge',
          name: '收费',
          component: () => import('../views/registration/expense_charge.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/expense_refund',
          name: '退费',
          component: () => import('../views/registration/expense_refund.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/expense_manage',
          name: '费用记录查询',
          component: () => import('../views/registration/expense_manage.vue'),
          meta: {
            isLogin: true
          }
        },
      ]
    }, {
      path: '/',
      name: '门诊医生',
      component: Layout,
      iconCls: "User",
      meta: {
        type: "门诊"
      },
      children: [
        {
          path: '/physician_patient',
          name: '患者查看',
          component: () => import('../views/physician/physician_patient.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/home_medical_record',
          name: '医生诊疗：病历首页',
          component: () => import('../views/physician/patient/home_medical_record.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/check_request',
          name: '医生诊疗：检查申请',
          component: () => import('../views/physician/patient/check_request.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/inspection_request',
          name: '医生诊疗：检验申请',
          component: () => import('../views/physician/patient/inspection_request.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/record',
          name: '看诊记录',
          component: () => import('../views/physician/patient/record.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/check_results',
          name: '医生诊疗：检查结果',
          component: () => import('../views/physician/patient/check_results.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/inspection_results',
          name: '医生诊疗：检验结果',
          component: () => import('../views/physician/patient/inspection_results.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/outpatient_diagnosis',
          name: '医生诊疗：门诊确诊',
          component: () => import('../views/physician/patient/outpatient_diagnosis.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/write_prescription',
          name: '医生诊疗：开设处方',
          component: () => import('../views/physician/patient/write_prescription.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/disposal_request',
          name: '医生诊疗：处置申请',
          component: () => import('../views/physician/patient/disposal_request.vue'),
          meta: {
            isLogin: true
          }
        },
        {
          path: '/expense_query',
          name: '医生诊疗：费用查询',
          component: () => import('../views/physician/patient/expense_query.vue'),
          meta: {
            isLogin: true
          }
        },

      ]
    }, {
      path: '/',
      component: Layout,
      name: '检查管理',
      iconCls: 'camera',
      meta: {
        type: "检查"
      },
      children: [
        {
          path: '/check_apply',
          name: '检查申请',
          component: () => import('../views/check/check_apply.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/check_patient',
          name: '检查患者录入',
          component: () => import('../views/check/check_patient.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/check_input',
          name: '检查结果录入',
          component: () => import('../views/check/check_input.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/check_manage',
          name: '检查管理1',
          component: () => import('../views/check/check_manage.vue'),
          meta: {
            isLogin: true
          }
        }
      ]
    }, {
      path: '/',
      name: '检验管理',
      component: Layout,
      iconCls: 'headset',
      meta: {
        type: "检验"
      },
      children: [
        {
          path: '/inspection_apply',
          name: '检验申请',
          component: () => import('../views/inspection/inspection_apply.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/inspection_patient',
          name: '检验患者录入',
          component: () => import('../views/inspection/inspection_patient.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/inspection_input',
          name: '检验结果录入',
          component: () => import('../views/inspection/inspection_input.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/inspection_manage',
          name: '检验管理1',
          component: () => import('../views/inspection/inspection_manage.vue'),
          meta: {
            isLogin: true
          }
        }
      ]
    }, {
      path: '/',
      name: '药房管理',
      component: Layout,
      iconCls: 'wallet',
      meta: {
        type: "药房"
      },
      children: [
        {
          path: '/give_medicine',
          name: '药房发药',
          component: () => import('../views/drugstore/give_medicine.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/refund_medicine',
          name: '药房退药',
          component: () => import('../views/drugstore/drug_medicine.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/drug_storage',
          name: '药库管理',
          component: () => import('../views/drugstore/drug_storage.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/tran_history',
          name: '交易记录',
          component: () => import('../views/drugstore/tran_history.vue'),
          meta: {
            isLogin: true
          }
        }
      ]
    }, {
      path: '/',
      name: '处置管理',
      component: Layout,
      iconCls: 'first-aid-kit',
      meta: {
        type: "处置"
      },
      children: [
        {
          path: '/disposal_apply',
          name: '处置申请',
          component: () => import('../views/disposal/disposal_apply.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/disposal_patient',
          name: '患者录入',
          component: () => import('../views/disposal/disposal_patient.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/disposal_input',
          name: '处置录入',
          component: () => import('../views/disposal/disposal_input.vue'),
          meta: {
            isLogin: true
          }
        }, {
          path: '/disposal_manage',
          name: '处置管理1',
          component: () => import('../views/disposal/disposal_manage.vue'),
          meta: {
            isLogin: true
          }
        }
      ]
    }
  ]
})

export default router