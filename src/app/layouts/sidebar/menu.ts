import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    // {
    //     id: 1,
    //     label: 'MENUITEMS.MENU.TEXT',
    //     isTitle: true
    // },
    // {
    //     id: 2,
    //     label: 'MENUITEMS.DASHBOARDS.TEXT',
    //     icon: 'bx-home-circle',
    //     badge: {
    //         variant: 'info',
    //         text: 'MENUITEMS.DASHBOARDS.BADGE',
    //     },
    //     subItems: [
    //         {
    //             id: 3,
    //             label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
    //             link: '/admin/dashboard',
    //             parentId: 2
    //         },
    //         {
    //             id: 4,
    //             label: 'MENUITEMS.DASHBOARDS.LIST.SAAS',
    //             link: '/admin/dashboards/saas',
    //             parentId: 2
    //         },
    //         {
    //             id: 5,
    //             label: 'MENUITEMS.DASHBOARDS.LIST.CRYPTO',
    //             link: '/admin/dashboards/crypto',
    //             parentId: 2
    //         },
    //         {
    //             id: 6,
    //             label: 'MENUITEMS.DASHBOARDS.LIST.BLOG',
    //             link: '/admin/dashboards/blog',
    //             parentId: 2
    //         },
    //     ]
    // },
    // {
    //     id: 7,
    //     isLayout: true
    // },
    // {
    //     id: 8,
    //     label: 'MENUITEMS.APPS.TEXT',
    //     isTitle: true
    // },
    // {
    //     id: 9,
    //     label: 'MENUITEMS.CALENDAR.TEXT',
    //     icon: 'bx-calendar',
    //     link: '/admin/calendar',
    // },
    {
      id: 10,
      label: 'Map',
      icon: 'bx-map-alt',
      link: '/admin/map',

  },
    {
        id: 11,
        label: 'Geo-ins',
        icon: 'bx-folder-open',
        subItems: [
            {
                id: 13,
                label: 'Projects',
                link: '/admin/geo-ins/projets',
                icon:'b',
                parentId: 12
            },
            {
                id: 14,
                label: "Maitres d'ouvrage",
                icon:'bx-user',
                link: '/admin/geo-ins/maitresOuvrage',
                parentId: 12
            }
        ]
    },
    {
      id: 12,
      label: 'Accounts Management',
      icon: 'bx-user-circle',
      link: '/admin/accountManagement'},
    {
      id: 21,
      label: 'Exchange',
      icon: 'bx-message-rounded',
      link: '/admin/exchange'},

    {
        id: 29,
        label: 'Reclamations',
        icon: 'bx-envelope',
        link:'/admin/reclamations'
        // subItems: [
        //     {
        //         id: 30,
        //         label: 'MENUITEMS.EMAIL.LIST.INBOX',
        //         link: '/admin/email/inbox',
        //         parentId: 29
        //     },
        //     {
        //         id: 31,
        //         label: 'MENUITEMS.EMAIL.LIST.READEMAIL',
        //         link: '/admin/email/read/1',
        //         parentId: 29
        //     },
        //     {
        //         id: 32,
        //         label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.TEXT',
        //         badge: {
        //             variant: 'success',
        //             text: 'MENUITEMS.EMAIL.LIST.TEMPLATE.BADGE',
        //         },
        //         parentId: 29,
        //         subItems: [
        //             {
        //                 id:33 ,
        //                 label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BASIC',
        //                 link: '/admin/email/basic',
        //                 parentId:32
        //             },
        //             {
        //                 id:34 ,
        //                 label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.ALERT',
        //                 link: '/admin/email/alert',
        //                 parentId:32
        //             },
        //             {
        //                 id:35 ,
        //                 label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BILLING',
        //                 link: '/admin/email/billing',
        //                 parentId:32
        //             }
        //         ]
        //     }
        // ]
    },
    {
      id: 24,
      label: 'Déconnexion',
      icon: 'bx-log-out',
      link: '/admin/exchange'},

    // {
    //     id: 36,
    //     label: 'MENUITEMS.INVOICES.TEXT',
    //     icon: 'bx-receipt',
    //     subItems: [
    //         {
    //             id: 37,
    //             label: 'MENUITEMS.INVOICES.LIST.INVOICELIST',
    //             link: '/admin/invoices/list',
    //             parentId: 36
    //         },
    //         {
    //             id: 38,
    //             label: 'MENUITEMS.INVOICES.LIST.INVOICEDETAIL',
    //             link: '/admin/invoices/detail',
    //             parentId: 36
    //         },
    //     ]
    // },
    // {
    //     id: 39,
    //     label: 'MENUITEMS.PROJECTS.TEXT',
    //     icon: 'bx-briefcase-alt-2',
    //     subItems: [
    //         {
    //             id: 40,
    //             label: 'MENUITEMS.PROJECTS.LIST.GRID',
    //             link: '/admin/projects/grid',
    //             parentId: 38
    //         },
    //         {
    //             id: 41,
    //             label: 'MENUITEMS.PROJECTS.LIST.PROJECTLIST',
    //             link: '/admin/projects/list',
    //             parentId: 38
    //         },
    //         {
    //             id: 42,
    //             label: 'MENUITEMS.PROJECTS.LIST.OVERVIEW',
    //             link: '/admin/projects/overview',
    //             parentId: 38
    //         },
    //         {
    //             id: 43,
    //             label: 'MENUITEMS.PROJECTS.LIST.CREATE',
    //             link: '/admin/projects/create',
    //             parentId: 38
    //         }
    //     ]
    // },
    // {
    //     id: 44,
    //     label: 'MENUITEMS.TASKS.TEXT',
    //     icon: 'bx-task',
    //     subItems: [
    //         {
    //             id: 45,
    //             label: 'MENUITEMS.TASKS.LIST.TASKLIST',
    //             link: '/admin/tasks/list',
    //             parentId: 44
    //         },
    //         {
    //             id: 46,
    //             label: 'MENUITEMS.TASKS.LIST.KANBAN',
    //             link: '/admin/tasks/kanban',
    //             parentId: 44
    //         },
    //         {
    //             id: 47,
    //             label: 'MENUITEMS.TASKS.LIST.CREATETASK',
    //             link: '/admin/tasks/create',
    //             parentId: 44
    //         }
    //     ]
    // },
    // {
    //     id: 48,
    //     label: 'MENUITEMS.CONTACTS.TEXT',
    //     icon: 'bxs-user-detail',
    //     subItems: [
    //         {
    //             id: 49,
    //             label: 'MENUITEMS.CONTACTS.LIST.USERGRID',
    //             link: '/admin/contacts/grid',
    //             parentId: 48
    //         },
    //         {
    //             id: 50,
    //             label: 'MENUITEMS.CONTACTS.LIST.USERLIST',
    //             link: '/admin/contacts/list',
    //             parentId: 48
    //         },
    //         {
    //             id: 51,
    //             label: 'MENUITEMS.CONTACTS.LIST.PROFILE',
    //             link: '/admin/contacts/profile',
    //             parentId: 48
    //         }
    //     ]
    // },
    // {
    //     id: 52,
    //     label: 'MENUITEMS.BLOG.TEXT',
    //     icon: 'bx-file',
    //     badge: {
    //         variant: 'success',
    //         text: 'MENUITEMS.EMAIL.LIST.TEMPLATE.BADGE',
    //     },
    //     subItems: [
    //         {
    //             id: 53,
    //             label: 'MENUITEMS.BLOG.LIST.BLOGLIST',
    //             link: '/admin/blog/list',
    //             parentId: 52
    //         },
    //         {
    //             id: 54,
    //             label: 'MENUITEMS.BLOG.LIST.BLOGGRID',
    //             link: '/admin/blog/grid',
    //             parentId: 52
    //         },
    //         {
    //             id: 55,
    //             label: 'MENUITEMS.BLOG.LIST.DETAIL',
    //             link: '/admin/blog/detail',
    //             parentId: 52
    //         },
    //     ]
    // },
    // {
    //     id: 56,
    //     label: 'MENUITEMS.PAGES.TEXT',
    //     isTitle: true
    // },
    // {
    //     id: 57,
    //     label: 'MENUITEMS.AUTHENTICATION.TEXT',
    //     icon: 'bx-user-circle',
    //     badge: {
    //         variant: 'success',
    //         text: 'MENUITEMS.AUTHENTICATION.BADGE',
    //     },
    //     subItems: [
    //         {
    //             id: 58,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
    //             link: '/admin/account/login',
    //             parentId: 57
    //         },
    //         {
    //             id: 59,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN2',
    //             link: '/admin/account/login-2',
    //             parentId: 57
    //         },
    //         {
    //             id: 60,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
    //             link: '/admin/account/signup',
    //             parentId: 57
    //         },
    //         {
    //             id: 61,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER2',
    //             link: '/admin/account/signup-2',
    //             parentId: 57
    //         },
    //         {
    //             id: 62,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
    //             link: '/admin/account/reset-password',
    //             parentId: 57
    //         },
    //         {
    //             id: 63,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD2',
    //             link: '/admin/account/recoverpwd-2',
    //             parentId: 57
    //         },
    //         {
    //             id: 64,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
    //             link: '/admin/pages/lock-screen-1',
    //             parentId: 57
    //         },
    //         {
    //             id: 65,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN2',
    //             link: '/admin/pages/lock-screen-2',
    //             parentId: 57
    //         },
    //         {
    //             id: 66,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
    //             link: '/admin/pages/confirm-mail',
    //             parentId: 57
    //         },
    //         {
    //             id: 67,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL2',
    //             link: '/admin/pages/confirm-mail-2',
    //             parentId: 57
    //         },
    //         {
    //             id: 68,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
    //             link: '/admin/pages/email-verification',
    //             parentId: 57
    //         },
    //         {
    //             id: 69,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION2',
    //             link: '/admin/pages/email-verification-2',
    //             parentId: 57
    //         },
    //         {
    //             id: 70,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
    //             link: '/admin/pages/two-step-verification',
    //             parentId: 57
    //         },
    //         {
    //             id: 71,
    //             label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION2',
    //             link: '/admin/pages/two-step-verification-2',
    //             parentId: 57
    //         }
    //     ]
    // },
    // {
    //     id: 72,
    //     label: 'MENUITEMS.UTILITY.TEXT',
    //     icon: 'bx-file',
    //     subItems: [
    //         {
    //             id: 73,
    //             label: 'MENUITEMS.UTILITY.LIST.STARTER',
    //             link: '/admin/pages/starter',
    //             parentId: 72
    //         },
    //         {
    //             id: 74,
    //             label: 'MENUITEMS.UTILITY.LIST.MAINTENANCE',
    //             link: '/admin/pages/maintenance',
    //             parentId: 72
    //         },
    //         {
    //             id: 74,
    //             label: 'Coming Soon',
    //             link: '/admin/pages/coming-soon',
    //             parentId: 72
    //         },
    //         {
    //             id: 75,
    //             label: 'MENUITEMS.UTILITY.LIST.TIMELINE',
    //             link: '/admin/pages/timeline',
    //             parentId: 72
    //         },
    //         {
    //             id: 76,
    //             label: 'MENUITEMS.UTILITY.LIST.FAQS',
    //             link: '/pages/faqs',
    //             parentId: 72
    //         },
    //         {
    //             id: 77,
    //             label: 'MENUITEMS.UTILITY.LIST.PRICING',
    //             link: '/admin/pages/pricing',
    //             parentId: 72
    //         },
    //         {
    //             id: 78,
    //             label: 'MENUITEMS.UTILITY.LIST.ERROR404',
    //             link: '/admin/pages/404',
    //             parentId: 72
    //         },
    //         {
    //             id: 79,
    //             label: 'MENUITEMS.UTILITY.LIST.ERROR500',
    //             link: '/admin/pages/500',
    //             parentId: 72
    //         },
    //     ]
    // },
    // {
    //     id: 80,
    //     label: 'MENUITEMS.COMPONENTS.TEXT',
    //     isTitle: true
    // },
    // {
    //     id: 81,
    //     label: 'MENUITEMS.UIELEMENTS.TEXT',
    //     icon: 'bx-tone',
    //     subItems: [
    //         {
    //             id: 82,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.ALERTS',
    //             link: '/admin/ui/alerts',
    //             parentId: 81
    //         },
    //         {
    //             id: 83,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.BUTTONS',
    //             link: '/admin/ui/buttons',
    //             parentId: 81
    //         },
    //         {
    //             id: 84,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.CARDS',
    //             link: '/admin/ui/cards',
    //             parentId: 81
    //         },
    //         {
    //             id: 85,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.CAROUSEL',
    //             link: '/admin/ui/carousel',
    //             parentId: 81
    //         },
    //         {
    //             id: 86,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.DROPDOWNS',
    //             link: '/admin/ui/dropdowns',
    //             parentId: 81
    //         },
    //         {
    //             id: 87,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.GRID',
    //             link: '/admin/ui/grid',
    //             parentId: 81
    //         },
    //         {
    //             id: 88,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.IMAGES',
    //             link: '/admin/ui/images',
    //             parentId: 81
    //         },
    //         {
    //             id: 88,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.LIGHTBOX',
    //             link: '/admin/ui/lightbox',
    //             parentId: 81
    //         },
    //         {
    //             id: 89,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.MODALS',
    //             link: '/admin/ui/modals',
    //             parentId: 81
    //         },
    //         {
    //             id: 90,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.RANGESLIDER',
    //             link: '/admin/ui/rangeslider',
    //             parentId: 81
    //         },
    //         {
    //             id: 91,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.PROGRESSBAR',
    //             link: '/admin/ui/progressbar',
    //             parentId: 81
    //         },
    //         {
    //             id: 92,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.PLACEHOLDER',
    //             link: '/admin/ui/placeholder',
    //             parentId: 81
    //         },
    //         {
    //             id: 93,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.SWEETALERT',
    //             link: '/admin/ui/sweet-alert',
    //             parentId: 81
    //         },
    //         {
    //             id: 94,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.TABS',
    //             link: '/admin/ui/tabs-accordions',
    //             parentId: 81
    //         },
    //         {
    //             id: 95,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.TYPOGRAPHY',
    //             link: '/admin/ui/typography',
    //             parentId: 81
    //         },
    //         {
    //             id: 96,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.VIDEO',
    //             link: '/admin/ui/video',
    //             parentId: 81
    //         },
    //         {
    //             id: 97,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.GENERAL',
    //             link: '/admin/ui/general',
    //             parentId: 81
    //         },
    //         {
    //             id: 98,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.COLORS',
    //             link: '/admin/ui/colors',
    //             parentId: 81
    //         },
    //         {
    //             id: 99,
    //             label: 'MENUITEMS.UIELEMENTS.LIST.CROPPER',
    //             link: '/admin/ui/image-crop',
    //             parentId: 81
    //         },
    //     ]
    // },
    // {
    //     id: 100,
    //     label: 'MENUITEMS.FORMS.TEXT',
    //     icon: 'bxs-eraser',
    //     badge: {
    //         variant: 'danger',
    //         text: 'MENUITEMS.FORMS.BADGE',
    //     },
    //     subItems: [
    //         {
    //             id: 101,
    //             label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
    //             link: '/admin/form/elements',
    //             parentId: 100
    //         },
    //         {
    //             id: 102,
    //             label: 'MENUITEMS.FORMS.LIST.LAYOUTS',
    //             link: '/admin/form/layouts',
    //             parentId: 100
    //         },
    //         {
    //             id: 103,
    //             label: 'MENUITEMS.FORMS.LIST.VALIDATION',
    //             link: '/admin/form/validation',
    //             parentId: 100
    //         },
    //         {
    //             id: 104,
    //             label: 'MENUITEMS.FORMS.LIST.ADVANCED',
    //             link: '/admin/form/advanced',
    //             parentId: 100
    //         },
    //         {
    //             id: 105,
    //             label: 'MENUITEMS.FORMS.LIST.EDITOR',
    //             link: '/admin/form/editor',
    //             parentId: 100
    //         },
    //         {
    //             id: 106,
    //             label: 'MENUITEMS.FORMS.LIST.FILEUPLOAD',
    //             link: '/admin/form/uploads',
    //             parentId: 100
    //         },
    //         {
    //             id: 107,
    //             label: 'MENUITEMS.FORMS.LIST.REPEATER',
    //             link: '/admin/form/repeater',
    //             parentId: 100
    //         },
    //         {
    //             id: 108,
    //             label: 'MENUITEMS.FORMS.LIST.WIZARD',
    //             link: '/admin/form/wizard',
    //             parentId: 100
    //         },
    //         {
    //             id: 109,
    //             label: 'MENUITEMS.FORMS.LIST.MASK',
    //             link: '/admin/form/mask',
    //             parentId: 100
    //         }
    //     ]
    // },
    // {
    //     id: 110,
    //     icon: 'bx-list-ul',
    //     label: 'MENUITEMS.TABLES.TEXT',
    //     subItems: [
    //         {
    //             id: 111,
    //             label: 'MENUITEMS.TABLES.LIST.BASIC',
    //             link: '/admin/tables/basic',
    //             parentId: 110
    //         },
    //         {
    //             id: 112,
    //             label: 'MENUITEMS.TABLES.LIST.ADVANCED',
    //             link: '/admin/tables/advanced',
    //             parentId: 110
    //         }
    //     ]
    // },
    // {
    //     id: 113,
    //     icon: 'bxs-bar-chart-alt-2',
    //     label: 'MENUITEMS.CHARTS.TEXT',
    //     subItems: [
    //         {
    //             id: 114,
    //             label: 'MENUITEMS.CHARTS.LIST.APEX',
    //             link: '/admin/charts/apex',
    //             parentId: 113
    //         },
    //         {
    //             id: 115,
    //             label: 'MENUITEMS.CHARTS.LIST.CHARTJS',
    //             link: '/admin/charts/chartjs',
    //             parentId: 113
    //         },
    //         {
    //             id: 116,
    //             label: 'MENUITEMS.CHARTS.LIST.CHARTIST',
    //             link: '/admin/charts/chartist',
    //             parentId: 113
    //         },
    //         {
    //             id: 117,
    //             label: 'MENUITEMS.CHARTS.LIST.ECHART',
    //             link: '/admin/charts/echart',
    //             parentId: 113
    //         }
    //     ]
    // },
    // {
    //     id: 118,
    //     label: 'MENUITEMS.ICONS.TEXT',
    //     icon: 'bx-aperture',
    //     subItems: [
    //         {
    //             id: 119,
    //             label: 'MENUITEMS.ICONS.LIST.BOXICONS',
    //             link: '/admin/icons/boxicons',
    //             parentId: 118
    //         },
    //         {
    //             id: 120,
    //             label: 'MENUITEMS.ICONS.LIST.MATERIALDESIGN',
    //             link: '/admin/icons/materialdesign',
    //             parentId: 118
    //         },
    //         {
    //             id: 121,
    //             label: 'MENUITEMS.ICONS.LIST.DRIPICONS',
    //             link: '/admin/icons/dripicons',
    //             parentId: 118
    //         },
    //         {
    //             id: 122,
    //             label: 'MENUITEMS.ICONS.LIST.FONTAWESOME',
    //             link: '/admin/icons/fontawesome',
    //             parentId: 118
    //         },
    //     ]
    // },
    // {
    //     id: 123,
    //     label: 'MENUITEMS.MAPS.TEXT',
    //     icon: 'bx-map',
    //     subItems: [
    //         {
    //             id: 124,
    //             label: 'MENUITEMS.MAPS.LIST.GOOGLEMAP',
    //             link: '/admin/maps/google',
    //             parentId: 123
    //         }
    //     ]
    // },
    // {
    //     id: 125,
    //     label: 'MENUITEMS.MULTILEVEL.TEXT',
    //     icon: 'bx-share-alt',
    //     subItems: [
    //         {
    //             id: 126,
    //             label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
    //             link: '#',
    //             parentId: 125
    //         },
    //         {
    //             id: 127,
    //             label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
    //             parentId: 125,
    //             subItems: [
    //                 {
    //                     id: 128,
    //                     label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
    //                     parentId: 127,
    //                 },
    //                 {
    //                     id: 129,
    //                     label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
    //                     parentId: 127,
    //                 }
    //             ]
    //         },
    //     ]
    // }
];

