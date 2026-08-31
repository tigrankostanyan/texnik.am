import { Language, OrderStatus, ServiceMode } from '../types';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  searchPlaceholder: string;
  allCategories: string;
  login: string;
  register: string;
  logout: string;
  switchRole: string;
  customerRole: string;
  specialistRole: string;
  adminRole: string;
  roleCustomerDesc: string;
  roleSpecialistDesc: string;
  roleAdminDesc: string;
  status: {
    created: string;
    sent_to_specialist: string;
    confirmed: string;
    on_the_way: string;
    in_progress: string;
    completed: string;
    closed: string;
    paid: string;
    cancelled: string;
  };
  serviceMode: {
    client_visit: string;
    remote: string;
    service_center: string;
  };
  nav: {
    catalog: string;
    myOrders: string;
    security: string;
    earnings: string;
    scheduleBio: string;
    overview: string;
    servicesManagement: string;
    ordersMonitoring: string;
    fraudModeration: string;
    brandingTheme: string;
    activeOrders: string;
    disputes: string;
  };
  catalog: {
    title: string;
    subtitle: string;
    findSpecialist: string;
    filterByCategory: string;
    sortBy: string;
    sortPopular: string;
    sortRating: string;
    sortPriceLow: string;
    sortPriceHigh: string;
    searchServices: string;
    orderNow: string;
    viewDetails: string;
    verifiedSpecialist: string;
    rating: string;
    completedOrders: string;
    startingFrom: string;
    amd: string;
    minShort: string;
    noServicesFound: string;
    resetFilters: string;
    fixedPrice: string;
    hourlyPrice: string;
    customQuote: string;
    popularBadge: string;
    bannerBadge: string;
    bannerTitle: string;
    bannerSubtitle: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
    showAll: string;
    servicesCount: string;
    specialistsCount: string;
    priceFrom: string;
    durationMinutes: string;
    allModes: string;
    serviceModeFilter: string;
    searchPlaceholder: string;
    noServicesDesc: string;
    bookNow: string;
    specialistGoes: string;
    customerBrings: string;
    phoneConsult: string;
  };
  wizard: {
    title: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    immediateBooking: string;
    scheduledBooking: string;
    addressInputLabel: string;
    problemDescLabel: string;
    attachmentsLabel: string;
    paymentMethodLabel: string;
    recommended: string;
    onlineEscrow: string;
    onlineEscrowDesc: string;
    cashOnDelivery: string;
    cashOnDeliveryDesc: string;
    basePriceLabel: string;
    calloutFeeLabel: string;
    totalLabel: string;
    back: string;
    next: string;
    confirmAndBook: string;
    confirmBooking: string;
    cancel: string;
    step3Escrow: string;
    step3Cash: string;
  };
  tracking: {
    client: string;
    viewReceipt: string;
    chat: string;
    call: string;
    report: string;
    backToOrders: string;
    orderNumber: string;
    specialistApproaching: string;
    etaPrefix: string;
    etaMinutes: string;
    serviceAddress: string;
    serviceMode: string;
    specialistAssigned: string;
    timelineTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    confirmCompletionBtn: string;
    viewInvoice: string;
    reviewedThankYou: string;
    leaveReview: string;
    reorderBtn: string;
    cancelOrder: string;
    rateSpecialistTitle: string;
    rateSpecialistDesc: string;
    reviewSuccess: string;
    reviewCommentLabel: string;
    reviewCommentPlaceholder: string;
    publishReviewBtn: string;
  };
  orderWizard: {
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    serviceDetails: string;
    selectMode: string;
    urgency: string;
    urgencyStandard: string;
    urgencyUrgent: string;
    urgencyEmergency: string;
    urgencyStandardDesc: string;
    urgencyUrgentDesc: string;
    urgencyEmergencyDesc: string;
    address: string;
    addressPlaceholder: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
    notesPlaceholder: string;
    paymentMethod: string;
    paymentCash: string;
    paymentCard: string;
    paymentIdram: string;
    totalEstimate: string;
    basePrice: string;
    urgencyFee: string;
    securityFee: string;
    confirmOrder: string;
    next: string;
    back: string;
    cancel: string;
    orderSuccessTitle: string;
    orderSuccessDesc: string;
    viewMyOrders: string;
  };
  orders: {
    title: string;
    subtitle: string;
    activeOrders: string;
    pastOrders: string;
    noActiveOrders: string;
    noPastOrders: string;
    createFirstOrder: string;
    orderNumber: string;
    specialist: string;
    status: string;
    date: string;
    price: string;
    trackOrder: string;
    viewInvoice: string;
    cancelOrder: string;
    leaveReview: string;
    reorder: string;
    chatWithSpecialist: string;
    callSpecialist: string;
  };
  specialist: {
    ordersDashboard: string;
    dashboardSubtitle: string;
    newRequests: string;
    inProgress: string;
    completed: string;
    accept: string;
    decline: string;
    onTheWay: string;
    startWork: string;
    finishWork: string;
    earningsTitle: string;
    totalEarnings: string;
    availableBalance: string;
    pendingPayout: string;
    commissionRate: string;
    requestPayout: string;
    scheduleTitle: string;
    availability: string;
    bioTitle: string;
    saveChanges: string;
  };
  admin: {
    dashboardTitle: string;
    dashboardSubtitle: string;
    statsTotalOrders: string;
    statsGrossVolume: string;
    statsPlatformRevenue: string;
    statsActiveSpecialists: string;
    antiFraudAlerts: string;
    recentActivities: string;
  };
  common: {
    loading: string;
    error: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    submit: string;
    yes: string;
    no: string;
    or: string;
    all: string;
    currency: string;
    minutes: string;
    hours: string;
    days: string;
    phone: string;
    email: string;
    name: string;
    language: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  hy: {
    appName: 'Varpet',
    appTagline: 'Վստահելի մասնագետներ և ծառայություններ ձեր կողքին',
    searchPlaceholder: 'Որոնել ծառայություն կամ մասնագետ...',
    allCategories: 'Բոլոր կատեգորիաները',
    login: 'Մուտք',
    register: 'Գրանցում',
    logout: 'Ելք',
    switchRole: 'Փոխել դերը',
    customerRole: 'Հաճախորդ',
    specialistRole: 'Մասնագետ',
    adminRole: 'Ադմինիստրատոր',
    roleCustomerDesc: 'Գտեք և պատվիրեք ծառայություններ',
    roleSpecialistDesc: 'Ընդունեք պատվերներ և կառավարեք աշխատանքը',
    roleAdminDesc: 'Հարթակի մոնիթորինգ և կառավարում',
    status: {
      created: 'Ստեղծված է',
      sent_to_specialist: 'Ուղարկված է մասնագետին',
      confirmed: 'Հաստատված է',
      on_the_way: 'Ճանապարհին է',
      in_progress: 'Ընթացքի մեջ է',
      completed: 'Ավարտված է',
      closed: 'Փակված է',
      paid: 'Վճարված է',
      cancelled: 'Չեղարկված է',
    },
    serviceMode: {
      client_visit: 'Այցելություն հաճախորդին',
      remote: 'Հեռավար / Օնլայն',
      service_center: 'Սերվիս կենտրոնում',
    },
    nav: {
      catalog: 'Ծառայությունների կատալոգ',
      myOrders: 'Իմ պատվերները',
      security: 'Անվտանգություն',
      earnings: 'Եկամուտներ',
      scheduleBio: 'Գրաֆիկ և Պրոֆիլ',
      overview: 'Ընդհանուր վիճակագրություն',
      servicesManagement: 'Ծառայությունների կառավարում',
      ordersMonitoring: 'Պատվերների մոնիթորինգ',
      fraudModeration: 'Անվտանգություն և Բողոքներ',
      brandingTheme: 'Բրենդինգ և Կարգավորումներ',
      activeOrders: 'Ակտիվ պատվերներ',
      disputes: 'Վեճեր և բողոքներ',
    },
    catalog: {
      title: 'Ծառայությունների կատալոգ',
      subtitle: 'Ընտրեք որակյալ և ստուգված մասնագետների հարյուրավոր ծառայություններից',
      findSpecialist: 'Գտնել մասնագետ',
      filterByCategory: 'Ֆիլտրել ըստ կատեգորիայի',
      sortBy: 'Տեսակավորել',
      sortPopular: 'Հանրաճանաչ',
      sortRating: 'Բարձր վարկանիշ',
      sortPriceLow: 'Գին՝ աճման կարգով',
      sortPriceHigh: 'Գին՝ նվազման կարգով',
      searchServices: 'Որոնել ծառայություն...',
      orderNow: 'Պատվիրել',
      viewDetails: 'Մանրամասն',
      verifiedSpecialist: 'Ստուգված մասնագետ',
      rating: 'Վարկանիշ',
      completedOrders: 'պատվեր',
      startingFrom: 'սկսած',
      amd: 'դրամ',
      minShort: 'րոպե',
      noServicesFound: 'Ծառայություններ չեն գտնվել',
      resetFilters: 'Մաքրել ֆիլտրերը',
      fixedPrice: 'Ֆիքսված գին',
      hourlyPrice: 'Ժամավճար',
      customQuote: 'Պայմանագրային',
      popularBadge: 'ԹՈՓ ԸՆՏՐՈՒԹՅՈՒՆ',
      bannerBadge: '100% Ստուգված մասնագետներ',
      bannerTitle: 'Գտեք լավագույն մասնագետներին րոպեների ընթացքում',
      bannerSubtitle: 'Որակյալ տեխնիկական սպասարկում, ծրագրային ապահովում և ֆոտոծառայություններ՝ անվտանգ վճարման և որակի երաշխիքով',
      categoriesTitle: 'Ծառայությունների Կատեգորիաներ',
      categoriesSubtitle: 'Ընտրեք ըստ ձեր նախընտրած ուղղության',
      showAll: 'Տեսնել բոլորը',
      servicesCount: 'ծառայություն',
      specialistsCount: 'մասնագետ',
      priceFrom: 'Սկսած',
      durationMinutes: 'րոպե',
      allModes: 'Բոլոր ռեժիմները',
      serviceModeFilter: 'Մատուցման եղանակ',
      searchPlaceholder: 'Որոնեք ըստ ծառայության, կատեգորիայի կամ խնդրի...',
      noServicesDesc: 'Փորձեք փոխել որոնման բառերը կամ մաքրել ֆիլտրերը',
      bookNow: 'Պատվիրել',
      specialistGoes: 'Այցելություն հաճախորդին',
      customerBrings: 'Սերվիս կենտրոնում',
      phoneConsult: 'Հեռավար / Օնլայն',
    },
    wizard: {
      title: 'Պատվերի ձևակերպում',
      step1Title: 'Ծառայության մանրամասներ',
      step2Title: 'Հասցե և Ժամանակ',
      step3Title: 'Վճարման եղանակ',
      step4Title: 'Հաստատում',
      immediateBooking: 'Անհապաղ այցելություն',
      scheduledBooking: 'Պլանավորված այցելություն',
      addressInputLabel: 'Հասցե',
      problemDescLabel: 'Խնդրի նկարագրություն',
      attachmentsLabel: 'Կցել լուսանկարներ / ֆայլեր',
      paymentMethodLabel: 'Վճարման եղանակ',
      recommended: 'Երաշխավորված',
      onlineEscrow: 'Էսքրոու Անվտանգ Վճարում',
      onlineEscrowDesc: 'Գումարը սառեցվում է և մասնագետին փոխանցվում միայն ձեր հաստատումից հետո',
      cashOnDelivery: 'Կանխիկ մասնագետին',
      cashOnDeliveryDesc: 'Վճարում եք աշխատանքը տեղում ընդունելուց հետո',
      basePriceLabel: 'Ծառայության արժեք',
      calloutFeeLabel: 'Այցելության վճար',
      totalLabel: 'Ընդամենը',
      back: 'Հետ',
      next: 'Առաջ',
      confirmAndBook: 'Հաստատել և պատվիրել',
      confirmBooking: 'Հաստատել պատվերը',
      cancel: 'Չեղարկել',
      step3Escrow: 'Էսքրոու',
      step3Cash: 'Կանխիկ',
    },
    tracking: {
      client: 'Հաճախորդ',
      viewReceipt: 'Դիտել կտրոնը',
      chat: 'Չաթ',
      call: 'Զանգահարել',
      report: 'Բողոքել',
      backToOrders: 'Վերադառնալ պատվերներին',
      orderNumber: 'Պատվեր',
      specialistApproaching: 'Մասնագետը մոտենում է',
      etaPrefix: 'Մոտավոր ժամանումը',
      etaMinutes: 'րոպե',
      serviceAddress: 'Սպասարկման հասցե',
      serviceMode: 'Մատուցման եղանակ',
      specialistAssigned: 'Կցված մասնագետ',
      timelineTitle: 'Պատվերի ընթացք',
      step1Title: 'Պատվերը ստեղծված է',
      step1Desc: 'Պատվերը գրանցվել է համակարգում',
      step2Title: 'Մասնագետը հաստատել է',
      step2Desc: 'Մասնագետը ծանոթացել է և ընդունել պատվերը',
      step3Title: 'Ճանապարհին է',
      step3Desc: 'Մասնագետը շարժվում է դեպի նշված հասցե',
      step4Title: 'Աշխատանքի կատարում',
      step4Desc: 'Մասնագետը կատարում է ծառայությունը',
      step5Title: 'Ավարտված և վճարված',
      step5Desc: 'Աշխատանքը հաջողությամբ ավարտվել է',
      confirmCompletionBtn: 'Հաստատել ավարտը և ազատել վճարումը',
      viewInvoice: 'Դիտել հաշիվ-ապրանքագիրը',
      reviewedThankYou: 'Շնորհակալություն կարծիքի համար',
      leaveReview: 'Գնահատել մասնագետին',
      reorderBtn: 'Կրկնել պատվերը',
      cancelOrder: 'Չեղարկել պատվերը',
      rateSpecialistTitle: 'Գնահատեք մասնագետի աշխատանքը',
      rateSpecialistDesc: 'Ձեր կարծիքը կօգնի բարելավել սպասարկման որակը',
      reviewSuccess: 'Կարծիքը հաջողությամբ պահպանվեց',
      reviewCommentLabel: 'Մեկնաբանություն',
      reviewCommentPlaceholder: 'Գրեք ձեր տպավորությունները...',
      publishReviewBtn: 'Հրապարակել կարծիքը',
    },
    orderWizard: {
      title: 'Պատվերի ձևակերպում',
      step1Title: 'Ծառայության մանրամասներ',
      step1Desc: 'Ընտրեք մատուցման եղանակը և հրատապությունը',
      step2Title: 'Հասցե և Ժամանակ',
      step2Desc: 'Նշեք ձեր հասցեն և հարմար ժամը',
      step3Title: 'Վճարման եղանակ',
      step3Desc: 'Ընտրեք վճարման անվտանգ եղանակը',
      step4Title: 'Հաստատում',
      step4Desc: 'Ստուգեք պատվերի մանրամասները',
      serviceDetails: 'Ծառայության տվյալներ',
      selectMode: 'Մատուցման եղանակ',
      urgency: 'Հրատապություն',
      urgencyStandard: 'Ստանդարտ',
      urgencyUrgent: 'Շտապ (+30%)',
      urgencyEmergency: 'Անհետաձգելի (+50%)',
      urgencyStandardDesc: 'Սովորական հերթով (24-48 ժամվա ընթացքում)',
      urgencyUrgentDesc: 'Մասնագետը կմոտենա 2-4 ժամում',
      urgencyEmergencyDesc: 'Մասնագետը կմոտենա 1 ժամվա ընթացքում',
      address: 'Հասցե',
      addressPlaceholder: 'Օր․՝ Երևան, Թումանյան փ․ 12, բն․ 4',
      preferredDate: 'Նախընտրելի օր',
      preferredTime: 'Նախընտրելի ժամ',
      notes: 'Լրացուցիչ նշումներ / Նկարագրություն',
      notesPlaceholder: 'Մանրամասնեք խնդիրը կամ աշխատանքի պահանջները...',
      paymentMethod: 'Վճարման եղանակ',
      paymentCash: 'Կանխիկ մասնագետին',
      paymentCard: 'Բանկային քարտ (Էսքրոու անվտանգ վճարում)',
      paymentIdram: 'Իդրամ / Թելսել',
      totalEstimate: 'Ընդհանուր արժեք',
      basePrice: 'Հիմնական գին',
      urgencyFee: 'Հրատապության հավելավճար',
      securityFee: 'Հարթակի անվտանգության երաշխիք',
      confirmOrder: 'Հաստատել պատվերը',
      next: 'Առաջ',
      back: 'Հետ',
      cancel: 'Չեղարկել',
      orderSuccessTitle: 'Պատվերը հաջողությամբ ստեղծվեց!',
      orderSuccessDesc: 'Մասնագետը կծանուցվի ձեր պատվերի մասին և կկապվի ձեզ հետ:',
      viewMyOrders: 'Տեսնել պատվերները',
    },
    orders: {
      title: 'Իմ Պատվերները',
      subtitle: 'Հետևեք ձեր ընթացիկ և պատմական պատվերների կարգավիճակին',
      activeOrders: 'Ակտիվ պատվերներ',
      pastOrders: 'Պատմություն',
      noActiveOrders: 'Ակտիվ պատվերներ չկան',
      noPastOrders: 'Ավարտված պատվերներ չկան',
      createFirstOrder: 'Ստեղծել առաջին պատվերը',
      orderNumber: 'Պատվեր №',
      specialist: 'Մասնագետ',
      status: 'Կարգավիճակ',
      date: 'Ամսաթիվ',
      price: 'Արժեք',
      trackOrder: 'Հետևել պատվերին',
      viewInvoice: 'Հաշիվ-ապրանքագիր',
      cancelOrder: 'Չեղարկել պատվերը',
      leaveReview: 'Թողնել կարծիք',
      reorder: 'Կրկնել պատվերը',
      chatWithSpecialist: 'Չաթ մասնագետի հետ',
      callSpecialist: 'Զանգահարել',
    },
    specialist: {
      ordersDashboard: 'Մասնագետի Վահանակ',
      dashboardSubtitle: 'Կառավարեք ձեր մուտքային և ընթացիկ աշխատանքները իրական ժամանակում',
      newRequests: 'Նոր հարցումներ',
      inProgress: 'Ընթացքի մեջ',
      completed: 'Ավարտված',
      accept: 'Ընդունել պատվերը',
      decline: 'Մերժել',
      onTheWay: 'Ես ճանապարհին եմ',
      startWork: 'Սկսել աշխատանքը',
      finishWork: 'Ավարտել աշխատանքը',
      earningsTitle: 'Եկամուտների Վերլուծություն',
      totalEarnings: 'Ընդհանուր եկամուտ',
      availableBalance: 'Հասանելի մնացորդ',
      pendingPayout: 'Ընթացքի մեջ փոխանցումներ',
      commissionRate: 'Հարթակի միջնորդավճար',
      requestPayout: 'Պահանջել փոխանցում քարտին',
      scheduleTitle: 'Աշխատանքային Գրաֆիկ և Բիո',
      availability: 'Հասանելիություն',
      bioTitle: 'Մասնագիտական տվյալներ',
      saveChanges: 'Պահպանել փոփոխությունները',
    },
    admin: {
      dashboardTitle: 'Ադմին Վահանակ',
      dashboardSubtitle: 'Հարթակի ընդհանուր վիճակագրություն, եկամուտներ և անվտանգություն',
      statsTotalOrders: 'Ընդհանուր պատվերներ',
      statsGrossVolume: 'Ընդհանուր շրջանառություն',
      statsPlatformRevenue: 'Հարթակի եկամուտ',
      statsActiveSpecialists: 'Ակտիվ մասնագետներ',
      antiFraudAlerts: 'Անվտանգության ահազանգեր',
      recentActivities: 'Վերջին գործողություններ',
    },
    common: {
      loading: 'Բեռնվում է...',
      error: 'Սխալ տեղի ունեցավ',
      save: 'Պահպանել',
      delete: 'Ջնջել',
      edit: 'Խմբագրել',
      close: 'Փակել',
      submit: 'Ուղարկել',
      yes: 'Այո',
      no: 'Ոչ',
      or: 'կամ',
      all: 'Բոլորը',
      currency: '֏',
      minutes: 'րոպե',
      hours: 'ժամ',
      days: 'օր',
      phone: 'Հեռախոսահամար',
      email: 'Էլ․ փոստ',
      name: 'Անուն Ազգանուն',
      language: 'Լեզու',
    },
  },
  ru: {
    appName: 'Varpet',
    appTagline: 'Надежные мастера и профессиональные услуги рядом с вами',
    searchPlaceholder: 'Поиск услуги или мастера...',
    allCategories: 'Все категории',
    login: 'Войти',
    register: 'Регистрация',
    logout: 'Выйти',
    switchRole: 'Сменить роль',
    customerRole: 'Клиент',
    specialistRole: 'Специалист',
    adminRole: 'Администратор',
    roleCustomerDesc: 'Находите и заказывайте проверенные услуги',
    roleSpecialistDesc: 'Принимайте заказы и управляйте работой',
    roleAdminDesc: 'Мониторинг платформы и управление процессами',
    status: {
      created: 'Создан',
      sent_to_specialist: 'Отправлен мастеру',
      confirmed: 'Подтвержден',
      on_the_way: 'Мастер в пути',
      in_progress: 'В процессе',
      completed: 'Завершен',
      closed: 'Закрыт',
      paid: 'Оплачен',
      cancelled: 'Отменен',
    },
    serviceMode: {
      client_visit: 'Выезд к клиенту',
      remote: 'Удаленно / Онлайн',
      service_center: 'В сервисном центре',
    },
    nav: {
      catalog: 'Каталог услуг',
      myOrders: 'Мои заказы',
      security: 'Безопасность',
      earnings: 'Доходы',
      scheduleBio: 'График и Профиль',
      overview: 'Общая статистика',
      servicesManagement: 'Управление услугами',
      ordersMonitoring: 'Мониторинг заказов',
      fraudModeration: 'Безопасность и жалобы',
      brandingTheme: 'Брендинг и Настройки',
      activeOrders: 'Активные заказы',
      disputes: 'Споры и жалобы',
    },
    catalog: {
      title: 'Каталог услуг',
      subtitle: 'Выберите из сотен услуг от проверенных и квалифицированных специалистов',
      findSpecialist: 'Найти специалиста',
      filterByCategory: 'Фильтр по категориям',
      sortBy: 'Сортировка',
      sortPopular: 'Популярные',
      sortRating: 'Высокий рейтинг',
      sortPriceLow: 'Сначала дешевле',
      sortPriceHigh: 'Сначала дороже',
      searchServices: 'Поиск услуги...',
      orderNow: 'Заказать',
      viewDetails: 'Подробнее',
      verifiedSpecialist: 'Проверенный мастер',
      rating: 'Рейтинг',
      completedOrders: 'заказов',
      startingFrom: 'от',
      amd: 'драм',
      minShort: 'мин',
      noServicesFound: 'Услуги не найдены',
      resetFilters: 'Сбросить фильтры',
      fixedPrice: 'Фиксированная цена',
      hourlyPrice: 'Почасовая оплата',
      customQuote: 'По договоренности',
      popularBadge: 'ТОП ВЫБОР',
      bannerBadge: '100% Проверенные мастера',
      bannerTitle: 'Найдите лучших мастеров за считанные минуты',
      bannerSubtitle: 'Качественный ремонт техники, настройка ПО и фотоуслуги с гарантией безопасной сделки и качества',
      categoriesTitle: 'Категории Услуг',
      categoriesSubtitle: 'Выберите подходящее направление для вашей задачи',
      showAll: 'Показать все',
      servicesCount: 'услуг',
      specialistsCount: 'мастеров',
      priceFrom: 'От',
      durationMinutes: 'мин',
      allModes: 'Все форматы',
      serviceModeFilter: 'Формат оказания',
      searchPlaceholder: 'Поиск по услугам, категориям или поломке...',
      noServicesDesc: 'Попробуйте изменить запрос или сбросить фильтры',
      bookNow: 'Заказать',
      specialistGoes: 'Выезд к клиенту',
      customerBrings: 'В сервис-центре',
      phoneConsult: 'Онлайн / Удаленно',
    },
    wizard: {
      title: 'Оформление заказа',
      step1Title: 'Детали услуги',
      step2Title: 'Адрес и Время',
      step3Title: 'Способ оплаты',
      step4Title: 'Подтверждение',
      immediateBooking: 'Срочный выезд',
      scheduledBooking: 'Запланированный визит',
      addressInputLabel: 'Адрес',
      problemDescLabel: 'Описание задачи / поломки',
      attachmentsLabel: 'Прикрепить фото / файлы',
      paymentMethodLabel: 'Способ оплаты',
      recommended: 'Рекомендуется',
      onlineEscrow: 'Безопасная сделка (Эскроу)',
      onlineEscrowDesc: 'Средства холдируются и переводятся мастеру только после вашего подтверждения',
      cashOnDelivery: 'Наличными мастеру',
      cashOnDeliveryDesc: 'Оплата производится после завершения и проверки работ',
      basePriceLabel: 'Стоимость услуги',
      calloutFeeLabel: 'Стоимость выезда',
      totalLabel: 'Итого',
      back: 'Назад',
      next: 'Далее',
      confirmAndBook: 'Подтвердить и заказать',
      confirmBooking: 'Подтвердить заказ',
      cancel: 'Отмена',
      step3Escrow: 'Эскроу',
      step3Cash: 'Наличные',
    },
    tracking: {
      client: 'Клиент',
      viewReceipt: 'Посмотреть чек',
      chat: 'Чат',
      call: 'Позвонить',
      report: 'Пожаловаться',
      backToOrders: 'Назад к заказам',
      orderNumber: 'Заказ',
      specialistApproaching: 'Мастер в пути',
      etaPrefix: 'Прибытие примерно через',
      etaMinutes: 'мин',
      serviceAddress: 'Адрес оказания услуги',
      serviceMode: 'Формат оказания',
      specialistAssigned: 'Назначенный специалист',
      timelineTitle: 'Статус выполнения заказа',
      step1Title: 'Заказ создан',
      step1Desc: 'Заказ зарегистрирован в системе',
      step2Title: 'Мастер подтвердил',
      step2Desc: 'Специалист принял заявку',
      step3Title: 'В пути',
      step3Desc: 'Мастер выехал по указанному адресу',
      step4Title: 'Выполнение работы',
      step4Desc: 'Специалист выполняет услугу',
      step5Title: 'Завершено и оплачено',
      step5Desc: 'Работа успешно завершена',
      confirmCompletionBtn: 'Подтвердить завершение и перевести оплату',
      viewInvoice: 'Посмотреть квитанцию',
      reviewedThankYou: 'Спасибо за ваш отзыв!',
      leaveReview: 'Оценить мастера',
      reorderBtn: 'Повторить заказ',
      cancelOrder: 'Отменить заказ',
      rateSpecialistTitle: 'Оцените работу мастера',
      rateSpecialistDesc: 'Ваш отзыв помогает контролировать качество услуг',
      reviewSuccess: 'Отзыв успешно сохранен',
      reviewCommentLabel: 'Комментарий',
      reviewCommentPlaceholder: 'Напишите ваши впечатления о работе...',
      publishReviewBtn: 'Опубликовать отзыв',
    },
    orderWizard: {
      title: 'Оформление заказа',
      step1Title: 'Детали услуги',
      step1Desc: 'Выберите формат и срочность выполнения',
      step2Title: 'Адрес и Время',
      step2Desc: 'Укажите удобное время и место визита',
      step3Title: 'Способ оплаты',
      step3Desc: 'Выберите безопасный способ расчета',
      step4Title: 'Подтверждение',
      step4Desc: 'Проверьте и подтвердите параметры заказа',
      serviceDetails: 'Параметры услуги',
      selectMode: 'Формат оказания услуги',
      urgency: 'Срочность',
      urgencyStandard: 'Стандартно',
      urgencyUrgent: 'Срочно (+30%)',
      urgencyEmergency: 'Экстренно (+50%)',
      urgencyStandardDesc: 'В обычном порядке (в течение 24-48 часов)',
      urgencyUrgentDesc: 'Мастер прибудет в течение 2-4 часов',
      urgencyEmergencyDesc: 'Мастер прибудет в течение 1 часа',
      address: 'Адрес',
      addressPlaceholder: 'Например: Ереван, ул. Туманяна 12, кв. 4',
      preferredDate: 'Желаемая дата',
      preferredTime: 'Желаемое время',
      notes: 'Примечания к заказу',
      notesPlaceholder: 'Опишите задачу или возникшую неисправность подробно...',
      paymentMethod: 'Способ оплаты',
      paymentCash: 'Наличными мастеру',
      paymentCard: 'Банковской картой (Безопасная сделка Эскроу)',
      paymentIdram: 'Idram / Telcell',
      totalEstimate: 'Итоговая стоимость',
      basePrice: 'Базовая цена',
      urgencyFee: 'Доплата за срочность',
      securityFee: 'Гарантия безопасности платформы',
      confirmOrder: 'Подтвердить заказ',
      next: 'Далее',
      back: 'Назад',
      cancel: 'Отмена',
      orderSuccessTitle: 'Заказ успешно создан!',
      orderSuccessDesc: 'Специалист получил уведомление и свяжется с вами в ближайшее время.',
      viewMyOrders: 'Перейти к заказам',
    },
    orders: {
      title: 'Мои Заказы',
      subtitle: 'Отслеживайте статус текущих и завершенных заказов',
      activeOrders: 'Активные заказы',
      pastOrders: 'История заказов',
      noActiveOrders: 'Нет активных заказов',
      noPastOrders: 'История заказов пуста',
      createFirstOrder: 'Сделать первый заказ',
      orderNumber: 'Заказ №',
      specialist: 'Мастер',
      status: 'Статус',
      date: 'Дата',
      price: 'Стоимость',
      trackOrder: 'Отследить заказ',
      viewInvoice: 'Квитанция / Инвойс',
      cancelOrder: 'Отменить заказ',
      leaveReview: 'Оставить отзыв',
      reorder: 'Повторить заказ',
      chatWithSpecialist: 'Чат с мастером',
      callSpecialist: 'Позвонить',
    },
    specialist: {
      ordersDashboard: 'Панель Специалиста',
      dashboardSubtitle: 'Управляйте входящими и активными заявками в реальном времени',
      newRequests: 'Новые заявки',
      inProgress: 'В работе',
      completed: 'Завершенные',
      accept: 'Принять заказ',
      decline: 'Отклонить',
      onTheWay: 'Я выехал',
      startWork: 'Начать работу',
      finishWork: 'Завершить работу',
      earningsTitle: 'Аналитика Доходов',
      totalEarnings: 'Общий доход',
      availableBalance: 'Доступно к выводу',
      pendingPayout: 'В процессе выплаты',
      commissionRate: 'Комиссия платформы',
      requestPayout: 'Запросить вывод на карту',
      scheduleTitle: 'График и Профиль',
      availability: 'Доступность для заказов',
      bioTitle: 'Профессиональные данные',
      saveChanges: 'Сохранить изменения',
    },
    admin: {
      dashboardTitle: 'Панель Администратора',
      dashboardSubtitle: 'Сводная статистика платформы, оборот и безопасность',
      statsTotalOrders: 'Всего заказов',
      statsGrossVolume: 'Общий оборот',
      statsPlatformRevenue: 'Выручка платформы',
      statsActiveSpecialists: 'Активных мастеров',
      antiFraudAlerts: 'Сигналы безопасности',
      recentActivities: 'Последние события',
    },
    common: {
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      close: 'Закрыть',
      submit: 'Отправить',
      yes: 'Да',
      no: 'Нет',
      or: 'или',
      all: 'Все',
      currency: '֏',
      minutes: 'мин',
      hours: 'ч',
      days: 'дн',
      phone: 'Номер телефона',
      email: 'Эл. почта',
      name: 'Имя и фамилия',
      language: 'Язык',
    },
  },
  en: {
    appName: 'Varpet',
    appTagline: 'Trusted local specialists and verified on-demand services',
    searchPlaceholder: 'Search services or verified experts...',
    allCategories: 'All Categories',
    login: 'Log In',
    register: 'Sign Up',
    logout: 'Log Out',
    switchRole: 'Switch Role',
    customerRole: 'Customer',
    specialistRole: 'Specialist',
    adminRole: 'Administrator',
    roleCustomerDesc: 'Find and book verified services with escrow guarantee',
    roleSpecialistDesc: 'Accept incoming orders and manage real-time tasks',
    roleAdminDesc: 'Platform oversight, analytics, and fraud moderation',
    status: {
      created: 'Created',
      sent_to_specialist: 'Sent to Specialist',
      confirmed: 'Confirmed',
      on_the_way: 'On the Way',
      in_progress: 'In Progress',
      completed: 'Completed',
      closed: 'Closed',
      paid: 'Paid',
      cancelled: 'Cancelled',
    },
    serviceMode: {
      client_visit: 'On-site Visit',
      remote: 'Remote / Online',
      service_center: 'At Service Center',
    },
    nav: {
      catalog: 'Services Catalog',
      myOrders: 'My Orders',
      security: 'Security',
      earnings: 'Earnings',
      scheduleBio: 'Schedule & Bio',
      overview: 'Platform Overview',
      servicesManagement: 'Services Management',
      ordersMonitoring: 'Orders Monitoring',
      fraudModeration: 'Trust & Safety',
      brandingTheme: 'Branding & Config',
      activeOrders: 'Active Orders',
      disputes: 'Disputes & Reports',
    },
    catalog: {
      title: 'Services Catalog',
      subtitle: 'Choose from hundreds of premium services delivered by verified professionals',
      findSpecialist: 'Find Specialist',
      filterByCategory: 'Filter by category',
      sortBy: 'Sort by',
      sortPopular: 'Most Popular',
      sortRating: 'Highest Rating',
      sortPriceLow: 'Price: Low to High',
      sortPriceHigh: 'Price: High to Low',
      searchServices: 'Search services...',
      orderNow: 'Book Now',
      viewDetails: 'View Details',
      verifiedSpecialist: 'Verified Pro',
      rating: 'Rating',
      completedOrders: 'orders',
      startingFrom: 'from',
      amd: 'AMD',
      minShort: 'min',
      noServicesFound: 'No services match your search',
      resetFilters: 'Reset filters',
      fixedPrice: 'Fixed price',
      hourlyPrice: 'Hourly rate',
      customQuote: 'Custom quote',
      popularBadge: 'TOP CHOICE',
      bannerBadge: '100% Verified Specialists',
      bannerTitle: 'Find Top Rated Specialists in Minutes',
      bannerSubtitle: 'Professional gadget repairs, software setups, and media services backed by escrow guarantee and quality assurance',
      categoriesTitle: 'Service Categories',
      categoriesSubtitle: 'Explore specialized categories tailored to your needs',
      showAll: 'Show All',
      servicesCount: 'services',
      specialistsCount: 'specialists',
      priceFrom: 'From',
      durationMinutes: 'min',
      allModes: 'All Modes',
      serviceModeFilter: 'Service Mode',
      searchPlaceholder: 'Search by service, category, or issue...',
      noServicesDesc: 'Try adjusting your search query or reset active filters',
      bookNow: 'Book Now',
      specialistGoes: 'On-site Visit',
      customerBrings: 'At Service Center',
      phoneConsult: 'Remote / Online',
    },
    wizard: {
      title: 'Book Service',
      step1Title: 'Service Details',
      step2Title: 'Location & Schedule',
      step3Title: 'Payment Method',
      step4Title: 'Review & Confirm',
      immediateBooking: 'Immediate Dispatch',
      scheduledBooking: 'Scheduled Slot',
      addressInputLabel: 'Service Address',
      problemDescLabel: 'Problem Description',
      attachmentsLabel: 'Attach Photos / Files',
      paymentMethodLabel: 'Payment Channel',
      recommended: 'Recommended',
      onlineEscrow: 'Online Escrow (Protected)',
      onlineEscrowDesc: 'Funds are securely held and released only after your approval',
      cashOnDelivery: 'Cash on Completion',
      cashOnDeliveryDesc: 'Pay the specialist directly after work verification',
      basePriceLabel: 'Base Service Rate',
      calloutFeeLabel: 'Callout Fee',
      totalLabel: 'Total',
      back: 'Back',
      next: 'Next',
      confirmAndBook: 'Confirm & Book',
      confirmBooking: 'Confirm Booking',
      cancel: 'Cancel',
      step3Escrow: 'Escrow',
      step3Cash: 'Cash',
    },
    tracking: {
      client: 'Client',
      viewReceipt: 'View Receipt',
      chat: 'Chat',
      call: 'Call',
      report: 'Report Issue',
      backToOrders: 'Back to Orders',
      orderNumber: 'Order',
      specialistApproaching: 'Specialist Approaching',
      etaPrefix: 'Estimated Arrival',
      etaMinutes: 'min',
      serviceAddress: 'Service Address',
      serviceMode: 'Service Mode',
      specialistAssigned: 'Assigned Specialist',
      timelineTitle: 'Order Timeline',
      step1Title: 'Order Created',
      step1Desc: 'Order registered in platform system',
      step2Title: 'Specialist Confirmed',
      step2Desc: 'Specialist accepted the order',
      step3Title: 'On the Way',
      step3Desc: 'Specialist is en route to location',
      step4Title: 'In Progress',
      step4Desc: 'Work is currently being performed',
      step5Title: 'Completed & Settled',
      step5Desc: 'Order finished and payment released',
      confirmCompletionBtn: 'Confirm Completion & Release Escrow',
      viewInvoice: 'View Invoice',
      reviewedThankYou: 'Thank you for your review!',
      leaveReview: 'Rate Specialist',
      reorderBtn: 'Reorder Service',
      cancelOrder: 'Cancel Order',
      rateSpecialistTitle: 'Rate Specialist Performance',
      rateSpecialistDesc: 'Your review helps uphold service quality standards',
      reviewSuccess: 'Review submitted successfully',
      reviewCommentLabel: 'Review Comment',
      reviewCommentPlaceholder: 'Share your experience...',
      publishReviewBtn: 'Publish Review',
    },
    orderWizard: {
      title: 'Book Service',
      step1Title: 'Service Details',
      step1Desc: 'Select delivery mode and urgency level',
      step2Title: 'Location & Schedule',
      step2Desc: 'Specify service address and convenient arrival time',
      step3Title: 'Payment Method',
      step3Desc: 'Choose secure payment channel',
      step4Title: 'Review & Confirm',
      step4Desc: 'Review order details before placing',
      serviceDetails: 'Service Parameters',
      selectMode: 'Service Delivery Mode',
      urgency: 'Urgency Level',
      urgencyStandard: 'Standard',
      urgencyUrgent: 'Urgent (+30%)',
      urgencyEmergency: 'Emergency (+50%)',
      urgencyStandardDesc: 'Standard scheduled slot (within 24-48 hours)',
      urgencyUrgentDesc: 'Specialist arrives within 2-4 hours',
      urgencyEmergencyDesc: 'Specialist dispatches immediately (within 1 hour)',
      address: 'Service Address',
      addressPlaceholder: 'e.g., Yerevan, Tumanyan st. 12, Apt 4',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time',
      notes: 'Additional Notes & Details',
      notesPlaceholder: 'Describe the issue or requirements clearly...',
      paymentMethod: 'Payment Channel',
      paymentCash: 'Cash on Completion',
      paymentCard: 'Credit/Debit Card (Escrow Protected)',
      paymentIdram: 'Idram / Telcell Wallet',
      totalEstimate: 'Total Estimated Cost',
      basePrice: 'Base Service Rate',
      urgencyFee: 'Urgency Surcharge',
      securityFee: 'Platform Buyer Protection Guarantee',
      confirmOrder: 'Confirm & Place Order',
      next: 'Next',
      back: 'Back',
      cancel: 'Cancel',
      orderSuccessTitle: 'Order Placed Successfully!',
      orderSuccessDesc: 'Your designated specialist has been notified and will contact you promptly.',
      viewMyOrders: 'View My Orders',
    },
    orders: {
      title: 'My Orders',
      subtitle: 'Track active appointments and past service history in real-time',
      activeOrders: 'Active Appointments',
      pastOrders: 'Past Orders',
      noActiveOrders: 'No active orders currently',
      noPastOrders: 'No past order history',
      createFirstOrder: 'Book Your First Service',
      orderNumber: 'Order #',
      specialist: 'Specialist',
      status: 'Status',
      date: 'Date',
      price: 'Price',
      trackOrder: 'Track Live Status',
      viewInvoice: 'View Invoice',
      cancelOrder: 'Cancel Order',
      leaveReview: 'Leave Review',
      reorder: 'Reorder Service',
      chatWithSpecialist: 'Chat with Specialist',
      callSpecialist: 'Call Specialist',
    },
    specialist: {
      ordersDashboard: 'Specialist Dashboard',
      dashboardSubtitle: 'Manage incoming requests, active job stages, and dispatches in real-time',
      newRequests: 'New Inquiries',
      inProgress: 'In Progress',
      completed: 'Completed',
      accept: 'Accept Order',
      decline: 'Decline',
      onTheWay: 'I am on the way',
      startWork: 'Start Job',
      finishWork: 'Mark Completed',
      earningsTitle: 'Earnings & Payouts',
      totalEarnings: 'Gross Revenue',
      availableBalance: 'Available for Payout',
      pendingPayout: 'Processing Payouts',
      commissionRate: 'Platform Fee',
      requestPayout: 'Request Bank Transfer',
      scheduleTitle: 'Work Schedule & Bio',
      availability: 'Accepting New Orders',
      bioTitle: 'Professional Credentials',
      saveChanges: 'Save Changes',
    },
    admin: {
      dashboardTitle: 'Admin Command Center',
      dashboardSubtitle: 'Live ecosystem metrics, revenue monitoring, and automated fraud prevention',
      statsTotalOrders: 'Total Orders',
      statsGrossVolume: 'Gross Merchandise Value',
      statsPlatformRevenue: 'Platform Net Revenue',
      statsActiveSpecialists: 'Active Verified Pros',
      antiFraudAlerts: 'Safety & Risk Alerts',
      recentActivities: 'Audit Log Feed',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      submit: 'Submit',
      yes: 'Yes',
      no: 'No',
      or: 'or',
      all: 'All',
      currency: '֏',
      minutes: 'min',
      hours: 'hrs',
      days: 'days',
      phone: 'Phone number',
      email: 'Email address',
      name: 'Full Name',
      language: 'Language',
    },
  },
};

// Helper translation mapping functions
export const getRoleText = (role: string, lang: Language = 'hy'): string => {
  const dict = translations[lang] || translations.hy;
  if (role === 'customer') return dict.customerRole;
  if (role === 'specialist') return dict.specialistRole;
  if (role === 'admin') return dict.adminRole;
  return role;
};

export const getOrderStatusText = (status: OrderStatus, lang: Language = 'hy'): string => {
  const dict = translations[lang] || translations.hy;
  return dict.status[status] || status;
};

export const getServiceModeText = (mode: ServiceMode, lang: Language = 'hy'): string => {
  const dict = translations[lang] || translations.hy;
  return dict.serviceMode[mode] || mode;
};

export const getCategoryName = (
  category?: { name?: string; nameHy?: string; nameRu?: string; nameEn?: string; title?: string },
  lang: Language = 'hy'
): string => {
  if (!category) return '';
  if (lang === 'hy') return category.nameHy || category.name || category.title || '';
  if (lang === 'ru') return category.nameRu || category.name || category.nameHy || category.title || '';
  if (lang === 'en') return category.nameEn || category.name || category.nameHy || category.title || '';
  return category.name || category.nameHy || category.title || '';
};

export const getServiceName = (
  service?: { name?: string; nameHy?: string; nameRu?: string; nameEn?: string; title?: string; titleRu?: string; titleEn?: string },
  lang: Language = 'hy'
): string => {
  if (!service) return '';
  if (lang === 'hy') return service.nameHy || service.name || service.title || '';
  if (lang === 'ru') return service.nameRu || service.titleRu || service.name || service.title || service.nameHy || '';
  if (lang === 'en') return service.nameEn || service.titleEn || service.name || service.title || service.nameHy || '';
  return service.name || service.nameHy || service.title || '';
};

export const getServiceDescription = (
  service?: { description?: string; descriptionHy?: string; descriptionRu?: string; descriptionEn?: string },
  lang: Language = 'hy'
): string => {
  if (!service) return '';
  if (lang === 'hy') return service.descriptionHy || service.description || '';
  if (lang === 'ru') return service.descriptionRu || service.description || service.descriptionHy || '';
  if (lang === 'en') return service.descriptionEn || service.description || service.descriptionHy || '';
  return service.description || service.descriptionHy || '';
};
