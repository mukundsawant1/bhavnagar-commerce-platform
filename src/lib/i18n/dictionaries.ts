export const APP_LANGUAGE_COOKIE = "app_lang";

export type AppLanguage = "en" | "hi" | "gu";

export type AppDictionary = {
  layout: {
    searchPlaceholder: string;
    searchButton: string;
    nav: {
      bulkShop: string;
      vegetables: string;
      fruits: string;
      buyerOrders: string;
      admin: string;
      farm: string;
    };
    account: string;
    orders: string;
    cart: string;
    checkout: string;
    stockBanner: string;
    workflowFooter: string;
    language: string;
    signInGreeting: string;
    returns: string;
    your: string;
  };
  home: {
    heroTagline: string;
    heroHeadline: string;
    heroCopy: string;
    ctaBuyer: string;
    ctaAdmin: string;
    ctaFarm: string;
    heroSlide1Headline: string;
    heroSlide1Subtext: string;
    heroSlide2Headline: string;
    heroSlide2Subtext: string;
    heroSlide3Headline: string;
    heroSlide3Subtext: string;
    buyerPanelTitle: string;
    buyerPanelDesc: string;
    farmPanelTitle: string;
    farmPanelDesc: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
    orderFlowTitle: string;
    orderFlowStep1Title: string;
    orderFlowStep1Desc: string;
    orderFlowStep2Title: string;
    orderFlowStep2Desc: string;
    orderFlowStep3Title: string;
    orderFlowStep3Desc: string;
    quickAccess: string;
    coreRoutes: string;
  };
  shop: {
    addBulkRequest: string;
    askAvailability: string;
  };
  cart: {
    title: string;
    subtitle: string;
    emptyMessage: string;
    summaryTitle: string;
    totalQuantity: string;
    estimatedValue: string;
    expectedLogistics: string;
    requestValue: string;
    submitForReview: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    sectionBuyerDetails: string;
    sectionOrderPayment: string;
    buyerPlaceholderBusiness: string;
    buyerPlaceholderContact: string;
    buyerPlaceholderCity: string;
    buyerPlaceholderPostal: string;
    orderTimelineTitle: string;
    orderStep1: string;
    orderStep2: string;
    orderStep3: string;
    orderStep4: string;
    currentEta: string;
    etaPending: string;
    agreementNote: string;
    submitOrder: string;
  };
  farm: {
    pageTitle: string;
    pageSubtitle: string;
    profileTitle: string;
    stockControlTitle: string;
    dispatchTitle: string;
    farmLabel: string;
    ownerLabel: string;
    locationLabel: string;
    contactLabel: string;
    listingLabel: string;
    gradeLabel: string;
    availableStockLabel: string;
    markAvailable: string;
    updateStock: string;
    markUnavailable: string;
    sendToAdmin: string;
  };
  account: {
    title: string;
    subtitle: string;
    roleGuide: string;
    buyerLine: string;
    adminLine: string;
    farmLine: string;
    gmailLine: string;
    paymentSuccess: string;
    checkoutCancelled: string;
    signInPrompt: string;
    configError: string;
  };
  auth: {
    signedIn: string;
    signOut: string;
    signIn: string;
    signUp: string;
    fullName: string;
    surname: string;
    emailAddress: string;
    gmailAddress: string;
    otpCode: string;
    requestOtp: string;
    verifyOtp: string;
    otpSent: string;
    otpVerified: string;
    otpRequired: string;
    otpBeforeGoogle: string;
    otpVerifyRequired: string;
    otpAuthSignInFailed: string;
    otpAttemptRemaining: string;
    otpMaxAttemptsReached: string;
    otpMaxAttemptsHelp: string;
    otpResendCooldown: string;
    authHelpText: string;
    cancel: string;
    fullNameRequired: string;
    password: string;
    emailInvalidError: string;
    createAccount: string;
    pleaseWait: string;
    continueGoogle: string;
    continueWithGoogleTitle: string;
    continueWithGoogleSubtitle: string;
    googleOAuthHint: string;
    checkAccount: string;
    checkingAccount: string;
    accountExists: string;
    accountNotFound: string;
    enterEmailToCheck: string;
    roleLabel: string;
    roleBuyer: string;
    roleAdmin: string;
    roleFarm: string;
    recentOrders: string;
    noRecentOrders: string;
    gmailOnlyHint: string;
    signedInSuccess: string;
    signedOutSuccess: string;
    signupSuccess: string;
    gmailOnlyError: string;
    authFailed: string;
  };
};

export const languageOptions: Array<{ code: AppLanguage; label: string }> = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "gu", label: "Gujarati" },
];

export const dictionaries: Record<AppLanguage, AppDictionary> = {
  en: {
    layout: {
      searchPlaceholder: "Search fruits, vegetables, farms",
      searchButton: "Search",
      nav: {
        bulkShop: "Bulk Shop",
        vegetables: "Vegetables",
        fruits: "Fruits",
        buyerOrders: "Buyer Orders",
        admin: "Admin",
        farm: "Farm",
      },
      account: "Account",
      orders: "Orders",
      cart: "Cart",
      checkout: "Checkout",
      stockBanner: "Live stock updates from farm owners",
      workflowFooter: "Buyer to admin to farm workflow ready",
      language: "Language",
      signInGreeting: "Hello, sign in",
      returns: "Returns",
      your: "Your",
    },
    home: {
      heroTagline: "Bulk Fruits And Vegetables Platform",
      heroHeadline: "Buyers, admin, and farms connected in one intelligent order flow.",
      heroCopy: "Place bulk orders, verify stock by farm, and receive realistic delivery dates that are confirmed through admin and farm owners.",
      ctaBuyer: "Place Bulk Order",
      ctaAdmin: "Open Admin Queue",
      ctaFarm: "Farm Owner Desk",
      buyerPanelTitle: "Bulk order in minutes",
      buyerPanelDesc: "Choose produce, minimum quantity, and preferred delivery window.",
      farmPanelTitle: "Live stock and date confirmation",
      farmPanelDesc: "Farm owner updates stock and dispatch date, admin confirms final delivery to buyer.",
      card1Title: "Buyer",
      card1Desc: "Create bulk order requests for fruits and vegetables.",
      card2Title: "Admin",
      card2Desc: "Assign farms based on available stock and confirm deliveries.",
      card3Title: "Farm Owner",
      card3Desc: "Mark produce available/unavailable and update stock.",
      card4Title: "Delivery Visibility",
      card4Desc: "Expected dispatch from farm and final date from admin.",
      heroSlide1Headline: "Buyers, admin, and farms in perfect sync",
      heroSlide1Subtext: "Bulk fruits and vegetables with live stock updates and delivery visibility",
      heroSlide2Headline: "Farm-fresh vegetables for bulk orders",
      heroSlide2Subtext: "From verified growers to your warehouse with admin checks in place",
      heroSlide3Headline: "Seasonal fruits delivered with quality assurance",
      heroSlide3Subtext: "Instant farm allocation, dispatch date and order certification",
      orderFlowTitle: "Order Flow",
      orderFlowStep1Title: "1. Buyer places order",
      orderFlowStep1Desc: "Select item and bulk quantity. Request enters admin queue.",
      orderFlowStep2Title: "2. Admin checks stock",
      orderFlowStep2Desc: "Admin validates farm inventory and places farm-side request.",
      orderFlowStep3Title: "3. Farm confirms date",
      orderFlowStep3Desc: "Farm sends expected dispatch date. Admin updates final delivery to buyer.",
      quickAccess: "Quick Access",
      coreRoutes: "Core Routes",
    },
    shop: {
      addBulkRequest: "Add Bulk Request",
      askAvailability: "Ask Availability",
    },
    cart: {
      title: "Bulk Request Cart",
      subtitle: "Review produce quantities before submitting to admin for farm allocation.",
      emptyMessage: "Your request cart is empty. Add fruits or vegetables from the bulk shop to create a purchase order.",
      summaryTitle: "Request Summary",
      totalQuantity: "Total Quantity",
      estimatedValue: "Estimated Item Value",
      expectedLogistics: "Expected Logistics",
      requestValue: "Request Value",
      submitForReview: "Submit For Admin Review",
    },
    checkout: {
      title: "Bulk Order Checkout",
      subtitle: "Submit order details. Admin will allocate stock from farms and confirm final delivery date.",
      sectionBuyerDetails: "1. Buyer And Delivery Details",
      sectionOrderPayment: "2. Order Submission And Payment",
      buyerPlaceholderBusiness: "Business name",
      buyerPlaceholderContact: "Contact number",
      buyerPlaceholderCity: "City",
      buyerPlaceholderPostal: "Postal code",
      orderTimelineTitle: "Order Timeline",
      orderStep1: "Buyer submits order",
      orderStep2: "Admin checks farm stock",
      orderStep3: "Farm confirms dispatch date",
      orderStep4: "Admin shares final delivery",
      currentEta: "Current ETA",
      etaPending: "Pending farm confirmation",
      agreementNote: "By placing your order, you agree to our terms and privacy policy.",
      submitOrder: "Submit Order Request",
    },
    farm: {
      pageTitle: "Farm Owner Desk",
      pageSubtitle: "Farm role: keep stock accurate, mark produce available or unavailable, and send expected dispatch dates to admin.",
      profileTitle: "Farm Profile",
      stockControlTitle: "My Stock Control",
      dispatchTitle: "Dispatch Date Update To Admin",
      farmLabel: "Farm:",
      ownerLabel: "Owner:",
      locationLabel: "Location:",
      contactLabel: "Contact:",
      listingLabel: "Listing",
      gradeLabel: "Grade",
      availableStockLabel: "Available stock:",
      markAvailable: "Mark Available",
      updateStock: "Update Stock",
      markUnavailable: "Mark Unavailable",
      sendToAdmin: "Send To Admin",
    },
    account: {
      title: "Account",
      subtitle: "Email sign-in for Buyer, Admin, and Farm Owner roles.",
      roleGuide: "Role Access Guide",
      buyerLine: "Buyer: place bulk fruit and vegetable orders and track delivery commitments.",
      adminLine: "Admin: review buyer orders, assign farm source, and confirm final delivery date.",
      farmLine: "Farm owner: update stock levels and expected dispatch date to admin.",
      gmailLine: "Enter your email or continue with Google to authenticate.",
      paymentSuccess: "Payment completed successfully. Your order status will update shortly.",
      checkoutCancelled: "Checkout was cancelled. You can retry from your cart.",
      signInPrompt: "Please sign in to access",
      configError: "Configuration is incomplete. Set Supabase env variables and try again.",
    },
    auth: {
      signedIn: "Signed In",
      signOut: "Sign Out",
      signIn: "Sign In",
      signUp: "Sign Up",
      fullName: "Full name",
      surname: "Surname (optional)",
      emailAddress: "Email address",
      gmailAddress: "Gmail address",
      otpCode: "OTP code",
      requestOtp: "Request OTP",
      verifyOtp: "Verify OTP",
      otpSent: "OTP generated. Check your email for the code.",
      otpVerified: "OTP verified. You are signed in.",
      otpRequired: "OTP code is required.",
      otpAttemptRemaining: "{count} attempt(s) remaining.",
      otpMaxAttemptsReached: "Maximum OTP attempts reached.",
      otpMaxAttemptsHelp: "Account locked for 15 minutes; contact support@bhavnagarstore.com.",
      otpResendCooldown: "Please wait before requesting a new OTP",
      authHelpText: "Sign in/up with email OTP. Limit 3 attempts before temporary lockout.",
      otpBeforeGoogle: "Request OTP first.",
      otpVerifyRequired: "Verify OTP before proceeding.",
      otpAuthSignInFailed: "OTP verified, but password sign-in failed.",
      fullNameRequired: "Full name is required for signup.",
      password: "Password",
      createAccount: "Create Account",
      pleaseWait: "Please wait...",
      continueGoogle: "Continue With Google",
      continueWithGoogleTitle: "Continue with Google",
      continueWithGoogleSubtitle: "Use Google to sign in quickly and stay signed in across devices.",
      googleOAuthHint: "Make sure Google OAuth is enabled in Supabase and redirect URLs include your app domain.",
      checkAccount: "Check if this email is already registered",
      checkingAccount: "Checking account…",
      accountExists: "Account found. You can sign in with Google.",
      accountNotFound: "No account found for this email. Please sign up first.",
      enterEmailToCheck: "Enter your email and click Check account to enable Google sign-in.",
      roleLabel: "Role",
      roleBuyer: "Buyer",
      roleAdmin: "Admin",
      roleFarm: "Farm Owner",
      recentOrders: "Recent Orders",
      noRecentOrders: "No recent orders found.",
      gmailOnlyHint: "Enter your email address and verify OTP before signing in.",
      cancel: "Cancel",
      signedInSuccess: "Signed in successfully.",
      signedOutSuccess: "Signed out.",
      signupSuccess: "Account created. Check your email for verification if enabled.",
      emailInvalidError: "Use a valid email address to continue.",
      gmailOnlyError: "Use a valid email address to continue.",
      authFailed: "Authentication failed.",
    },
  },
  hi: {
    layout: {
      searchPlaceholder: "फल, सब्जियां, फार्म खोजें",
      searchButton: "खोजें",
      nav: {
        bulkShop: "थोक बाजार",
        vegetables: "सब्जियां",
        fruits: "फल",
        buyerOrders: "खरीदार ऑर्डर",
        admin: "एडमिन",
        farm: "फार्म",
      },
      account: "खाता",
      orders: "ऑर्डर",
      cart: "कार्ट",
      checkout: "चेकआउट",
      stockBanner: "फार्म मालिकों से लाइव स्टॉक अपडेट",
      workflowFooter: "खरीदार से एडमिन से फार्म वर्कफ्लो तैयार",
      language: "भाषा",
      signInGreeting: "नमस्ते, साइन इन करें",
      returns: "रिटर्न",
      your: "आपका",
    },
    home: {
      heroTagline: "थोक फल और सब्ज़ी प्लेटफ़ॉर्म",
      heroHeadline: "खरीदार, एडमिन, और फार्म एक स्मार्ट ऑर्डर फ़्लो में जुड़े हुए।",
      heroCopy: "थोक ऑर्डर दें, फार्म द्वारा स्टॉक सत्यापित करें, और वास्तविक डिलीवरी तिथियाँ प्राप्त करें जो एडमिन और फार्म मालिकों द्वारा पुष्टि की जाती हैं।",
      ctaBuyer: "थोक ऑर्डर करें",
      ctaAdmin: "एडमिन कतार खोलें",
      ctaFarm: "फार्म मालिक डेस्क",
      heroSlide1Headline: "खरीदार, प्रशासन और फार्म एक साथ जुड़े",
      heroSlide1Subtext: "थोक फल और सब्ज़ियाँ लाइव स्टॉक अपडेट और वितरण दृश्यता के साथ",
      heroSlide2Headline: "थोक आदेशों के लिए ताज़ा फार्म सब्ज़ियाँ",
      heroSlide2Subtext: "पुष्ट उगाने वालों से आपके वेयरहाउस तक प्रशासनिक जांच के साथ",
      heroSlide3Headline: "मौसमीन फल गुणवत्तापूर्ण डिलीवरी के साथ",
      heroSlide3Subtext: "त्वरित फार्म आवंटन, प्रेषण तिथि और ऑर्डर प्रमाणन",
      buyerPanelTitle: "मिनटों में थोक ऑर्डर",
      buyerPanelDesc: "उत्पाद चुनें, न्यूनतम मात्रा और पसंदीदा डिलीवरी विंडो।",
      farmPanelTitle: "लाइव स्टॉक और तारीख पुष्टि",
      farmPanelDesc: "फार्म मालिक स्टॉक और डिस्पैच तारीख अपडेट करते हैं, एडमिन अंतिम डिलीवरी साझा करता है।",
      card1Title: "खरीदार",
      card1Desc: "फल और सब्ज़ियों के लिए थोक ऑर्डर अनुरोध बनाएं।",
      card2Title: "एडमिन",
      card2Desc: "उपलब्ध स्टॉक के आधार पर फार्म असाइन करें और डिलीवरी की पुष्टि करें।",
      card3Title: "फार्म मालिक",
      card3Desc: "उत्पाद को उपलब्ध/अनुपलब्ध चिह्नित करें और स्टॉक अपडेट करें।",
      card4Title: "डिलीवरी दृश्यता",
      card4Desc: "फार्म से अपेक्षित डिस्पैच और एडमिन से अंतिम तिथि।",
      orderFlowTitle: "ऑर्डर फ़्लो",
      orderFlowStep1Title: "1. खरीदार ऑर्डर करता है",
      orderFlowStep1Desc: "आइटम और थोक मात्रा चुनें। अनुरोध एडमिन कतार में जाता है।",
      orderFlowStep2Title: "2. एडमिन स्टॉक जांचता है",
      orderFlowStep2Desc: "एडमिन फार्म इन्वेंट्री की पुष्टि करता है और फार्म-पक्ष अनुरोध देता है।",
      orderFlowStep3Title: "3. फार्म तारीख की पुष्टि करता है",
      orderFlowStep3Desc: "फार्म अपेक्षित डिस्पैच तारीख भेजता है। एडमिन अंतिम डिलीवरी अपडेट करता है।",
      quickAccess: "त्वरित पहुंच",
      coreRoutes: "मुख्य रूट",
    },
    shop: {
      addBulkRequest: "थोक अनुरोध जोड़ें",
      askAvailability: "उपलब्धता पूछें",
    },
    cart: {
      title: "थोक अनुरोध कार्ट",
      subtitle: "खेत आवंटन के लिए एडमिन को भेजने से पहले उत्पाद मात्रा की समीक्षा करें।",
      emptyMessage: "आपका अनुरोध कार्ट खाली है। एक खरीद आदेश बनाने के लिए थोक शॉप से फल या सब्जियां जोड़ें।",
      summaryTitle: "अनुरोध सारांश",
      totalQuantity: "कुल मात्रा",
      estimatedValue: "अनुमानित आइटम मूल्य",
      expectedLogistics: "अपेक्षित लॉजिस्टिक्स",
      requestValue: "अनुरोध मूल्य",
      submitForReview: "एडमिन समीक्षा हेतु भेजें",
    },
    checkout: {
      title: "थोक ऑर्डर चेकआउट",
      subtitle: "ऑर्डर विवरण जमा करें। एडमिन खेत से स्टॉक अलॉट करेगा और अंतिम डिलीवरी तिथि की पुष्टि करेगा।",
      sectionBuyerDetails: "1. खरीदार और डिलीवरी विवरण",
      sectionOrderPayment: "2. ऑर्डर सबमिशन और भुगतान",
      buyerPlaceholderBusiness: "व्यवसाय का नाम",
      buyerPlaceholderContact: "संपर्क नंबर",
      buyerPlaceholderCity: "शहर",
      buyerPlaceholderPostal: "पिन कोड",
      orderTimelineTitle: "ऑर्डर समयरेखा",
      orderStep1: "खरीदार ऑर्डर सबमिट करता है",
      orderStep2: "एडमिन खेत स्टॉक की जांच करता है",
      orderStep3: "खेत डिस्पैच तिथि की पुष्टि करता है",
      orderStep4: "एडमिन अंतिम डिलीवरी साझा करता है",
      currentEta: "वर्तमान ईटीए",
      etaPending: "फार्म पुष्टि लंबित है",
      agreementNote: "ऑर्डर देने पर, आप हमारी शर्तों और गोपनीयता नीति से सहमत होते हैं।",
      submitOrder: "ऑर्डर अनुरोध जमा करें",
    },
    farm: {
      pageTitle: "फार्म मालिक डेस्क",
      pageSubtitle: "फार्म भूमिका: स्टॉक सटीक रखें, उत्पाद को उपलब्ध/अनुपलब्ध चिह्नित करें, और अपेक्षित डिस्पैच तिथियाँ एडमिन को भेजें।",
      profileTitle: "फार्म प्रोफ़ाइल",
      stockControlTitle: "मेरा स्टॉक नियंत्रण",
      dispatchTitle: "एडमिन को डिस्पैच तिथि अपडेट",
      farmLabel: "फार्म:",
      ownerLabel: "मालिक:",
      locationLabel: "स्थान:",
      contactLabel: "संपर्क:",
      listingLabel: "लिस्टिंग",
      gradeLabel: "ग्रेड",
      availableStockLabel: "उपलब्ध स्टॉक:",
      markAvailable: "उपलब्ध करें",
      updateStock: "स्टॉक अपडेट करें",
      markUnavailable: "अनुपलब्ध करें",
      sendToAdmin: "एडमिन को भेजें",
    },
    account: {
      title: "खाता",
      subtitle: "खरीदार, एडमिन और फार्म मालिक भूमिकाओं के लिए जीमेल-प्रथम साइन-इन।",
      roleGuide: "भूमिका पहुंच मार्गदर्शिका",
      buyerLine: "खरीदार: थोक फल-सब्जी ऑर्डर करें और डिलीवरी स्थिति ट्रैक करें।",
      adminLine: "एडमिन: खरीदार ऑर्डर देखें, फार्म चुनें और अंतिम डिलीवरी तिथि तय करें।",
      farmLine: "फार्म मालिक: स्टॉक स्तर और अपेक्षित डिस्पैच तिथि अपडेट करें।",
      gmailLine: "पंजीकरण के लिए जीमेल या गूगल के साथ जारी रखें का उपयोग करें।",
      paymentSuccess: "भुगतान सफलतापूर्वक पूरा हुआ। आपका ऑर्डर स्थिति शीघ्र ही अपडेट हो जाएगी।",
      checkoutCancelled: "चेकआउट रद्द कर दिया गया था। आप इसे अपने कार्ट से फिर से प्रयास कर सकते हैं।",
      signInPrompt: "कृपया साइन इन करें ताकि आप तक पहुँच सकें",
      configError: "कॉन्फ़िगरेशन अधूरी है। Supabase एन्व मान सेट करें और पुनः प्रयास करें।",
    },
    auth: {
      signedIn: "साइन इन",
      signOut: "साइन आउट",
      signIn: "साइन इन",
      signUp: "साइन अप",
      fullName: "पूरा नाम",
      surname: "उपनाम (वैकल्पिक)",
      emailAddress: "ईमेल पता",
      gmailAddress: "जीमेल पता",
      otpCode: "ओटीपी कोड",
      requestOtp: "ओटीपी भेजें",
      verifyOtp: "ओटीपी सत्यापित करें",
      otpSent: "ओटीपी जनरेट किया गया। कोड के लिए अपनी ईमेल जांचें।",
      otpVerified: "ओटीपी सत्यापित हुआ। आप अब साइन इन हैं।",
      otpRequired: "ओटीपी कोड आवश्यक है।",
      otpAttemptRemaining: "{count} प्रयास बचे हैं।",
      otpMaxAttemptsReached: "अधिकतम ओटीपी प्रयासों की सीमा पार हो गई है।",
      otpMaxAttemptsHelp: "15 मिनट के लिए खाता लॉक किया गया; support@bhavnagarstore.com से संपर्क करें।",
      otpResendCooldown: "नया ओटीपी अनुरोध करने से पहले प्रतीक्षा करें",
      authHelpText: "इमेल ओटीपी के साथ साइन इन/अप करें। अस्थायी लॉकआउट से पहले 3 प्रयास।",
      otpBeforeGoogle: "सबसे पहले ओटीपी अनुरोध करें।",
      otpVerifyRequired: "आगे बढ़ने से पहले ओटीपी सत्यापित करें।",
      otpAuthSignInFailed: "ओटीपी सत्यापित किया गया, लेकिन पासवर्ड साइन-इन विफल रहा।",
      fullNameRequired: "साइन अप के लिए पूरा नाम आवश्यक है।",
      password: "पासवर्ड",
      createAccount: "खाता बनाएं",
      pleaseWait: "कृपया प्रतीक्षा करें...",
      continueGoogle: "गूगल के साथ जारी रखें",
      continueWithGoogleTitle: "गूगल के साथ जारी रखें",
      continueWithGoogleSubtitle: "त्वरित साइन-इन के लिए गूगल का उपयोग करें।",
      googleOAuthHint: "सुनिश्चित करें कि Supabase में Google OAuth सक्षम है और रीडायरेक्ट URL सही हैं।",
      checkAccount: "जांचें कि यह ईमेल पहले से पंजीकृत है",
      checkingAccount: "खाता जांचा जा रहा है…",
      accountExists: "खाता मिला। आप Google से साइन इन कर सकते हैं।",
      accountNotFound: "इस ईमेल के लिए कोई खाता नहीं मिला। कृपया पहले साइन अप करें।",
      enterEmailToCheck: "Google साइन-इन सक्षम करने के लिए अपना ईमेल दर्ज करें और खाता जांचें पर क्लिक करें।",
      roleLabel: "भूमिका",
      roleBuyer: "खरीदार",
      roleAdmin: "एडमिन",
      roleFarm: "फार्म मालिक",
      recentOrders: "हाल के ऑर्डर",
      noRecentOrders: "कोई हालिया ऑर्डर नहीं मिला।",
      gmailOnlyHint: "अपना ईमेल पता दर्ज करें और ओटीपी सत्यापित करें।",
      cancel: "रद्द करें",
      signedInSuccess: "सफलतापूर्वक साइन इन हुआ।",
      signedOutSuccess: "साइन आउट हुआ।",
      signupSuccess: "खाता बन गया। यदि सक्षम हो तो सत्यापन ईमेल देखें।",
      emailInvalidError: "आगे बढ़ने के लिए मान्य ईमेल पता उपयोग करें।",
      gmailOnlyError: "आगे बढ़ने के लिए मान्य ईमेल पता उपयोग करें।",
      authFailed: "प्रमाणीकरण विफल।",
    },
  },
  gu: {
    layout: {
      searchPlaceholder: "ફળ, શાકભાજી, ફાર્મ શોધો",
      searchButton: "શોધો",
      nav: {
        bulkShop: "થોક બજાર",
        vegetables: "શાકભાજી",
        fruits: "ફળ",
        buyerOrders: "ખરીદાર ઓર્ડર",
        admin: "એડમિન",
        farm: "ફાર્મ",
      },
      account: "એકાઉન્ટ",
      orders: "ઓર્ડર",
      cart: "કાર્ટ",
      checkout: "ચેકઆઉટ",
      stockBanner: "ફાર્મ માલિકો તરફથી લાઇવ સ્ટોક અપડેટ",
      workflowFooter: "ખરીદાર થી એડમિન થી ફાર્મ વર્કફ્લો તૈયાર",
      language: "ભાષા",
      signInGreeting: "હલ્લો, સાઇન ઈન કરો",
      returns: "રીટર્ન",
      your: "તમારું",
    },
    home: {
      heroTagline: "થોક ફળ અને શાકભાજી પ્લેટફોર્મ",
      heroHeadline: "ખરીદાર, એડમિન અને ફાર્મ એક સ્માર્ટ ઓર્ડર ફ્લો માં જોડાયેલા છે.",
      heroCopy: "થોક ઓર્ડરો મૂકો, ફાર્મ દ્વારા સ્ટોક ચકાસો, અને વ્યાવહારિક ડિલિવરી તારીખો મેળવો જે એડમિન અને ફાર્મ માલિકો દ્વારા પુષ્ટિ થાય છે.",
      ctaBuyer: "થોક ઓર્ડર કરો",
      ctaAdmin: "એડમિન ક્યુ ખોલો",
      ctaFarm: "ફાર્મ માલિક ડેસ્ક",
      heroSlide1Headline: "ખરીદાર, એડમિન અને ફાર્મ એકસાથ",
      heroSlide1Subtext: "થોક ફળો અને શાકભાજી લાઇવ સ્ટોક અપડેટ સાથે",
      heroSlide2Headline: "થોક ઓર્ડર્સ માટે તાજી શાકભાજી",
      heroSlide2Subtext: "ચકાસેલ ઉગાડનાર પાસેથી તમારા વેરહાઉસ સુધી",
      heroSlide3Headline: "મોસમી ફળો ગુણવત્તા ખાતરી સાથે પહોંચાડાય છે",
      heroSlide3Subtext: "તુરંત ફાર્મ ફાળવણી અને ડિસ્પેચ અપડેટ",
      buyerPanelTitle: "મિનિટોમાં થોક ઓર્ડર",
      buyerPanelDesc: "ઉત્પાદનો પસંદ કરો, ન્યૂનતમ જથ્થો અને પસંદગીની ડિલિવરી વિન્ડો.",
      farmPanelTitle: "લાઇવ સ્ટોક અને તારીખ પુષ્ટિ",
      farmPanelDesc: "ફાર્મ માલિક સ્ટોક અને ડિસ્પેચ 날짜 અપડેટ કરે છે, એડમિન અંતિમ ડિલિવરી સાથે શેર કરે છે.",
      card1Title: "ખરીદાર",
      card1Desc: "ફળ અને શાકભાજી માટે થોક ઓર્ડર વિનંતી બનાવો.",
      card2Title: "એડમિન",
      card2Desc: "ઉપલબ્ધ સ્ટોકના આધારે ફાર્મ પસંદ કરો અને ડિલિવરીની પુષ્ટિ કરો.",
      card3Title: "ફાર્મ માલિક",
      card3Desc: "ઉત્પાદનને ઉપલબ્ધ/અનુપલબ્ધ તરીકે ચિહ્નિત કરો અને સ્ટોક અપડેટ કરો.",
      card4Title: "ડિલિવરી દૃશ્યતા",
      card4Desc: "ફાર્મથી અપેક્ષિત ડિસ્પેચ અને એડમિનથી અંતિમ તારીખ.",
      orderFlowTitle: "ઓર્ડર ફ્લો",
      orderFlowStep1Title: "1. ખરીદાર ઓર્ડર મૂકે છે",
      orderFlowStep1Desc: "આઇટમ અને થોક જથ્થો પસંદ કરો. વિનંતી એડમિન ક્યૂ માં જાય છે.",
      orderFlowStep2Title: "2. એડમિન સ્ટોક તપાસે છે",
      orderFlowStep2Desc: "એડમિન ફાર્મ ઇન્વેન્ટરી ચકાસે છે અને ફાર્મ તરફ વિનંતી મૂકે છે.",
      orderFlowStep3Title: "3. ફાર્મ તારીખ પુષ્ટિ કરે છે",
      orderFlowStep3Desc: "ફાર્મ અપેક્ષિત ડિસ્પેચ તારીખ મોકલે છે. એડમિન ખરીદારને ફાઇનલ ડિલિવરી અપડેટ કરે છે.",
      quickAccess: "ઝડપી ઍક્સેસ",
      coreRoutes: "મુખ્ય રૂટ્સ",
    },
    shop: {
      addBulkRequest: "થોક વિનંતી ઉમેરો",
      askAvailability: "ઉપલબ્ધતા પૂછો",
    },
    cart: {
      title: "થોક વિનંતી કાર્ટ",
      subtitle: "ખેતરની ફાળવણી માટે એડમિનને મોકલવા પહેલા ઉત્પાદનની માત્રા ફરીથી માપો.",
      emptyMessage: "તમારું વિનંતી કાર્ટ ખાલી છે. ખરીદી ઓર્ડર બનાવવા માટે થોક શોપમાંથી ફળો અથવા શાકભાજી ઉમેરો.",
      summaryTitle: "વિનંતી સારાંશ",
      totalQuantity: "કુલ જથ્થો",
      estimatedValue: "અનુમાનિત વસ્તુ મૂલ્ય",
      expectedLogistics: "અપેક્ષિત લોજિસ્ટિક્સ",
      requestValue: "વિનંતી મૂલ્ય",
      submitForReview: "એડમિન સમીક્ષા માટે મોકલો",
    },
    checkout: {
      title: "થોક ઓર્ડર ચેકઆઉટ",
      subtitle: "ઓર્ડર વિગતો સબમિટ કરો. એડમિન ફાર્મથી સ્ટોક ફાળવશે અને અંતિમ ડિલિવરી તારીખની પુષ્ટિ કરશે.",
      sectionBuyerDetails: "1. ખરીદાર અને ડિલિવરી વિગતો",
      sectionOrderPayment: "2. ઓર્ડર સબમિશન અને ચુકવણી",
      buyerPlaceholderBusiness: "વ્યવસાયનું નામ",
      buyerPlaceholderContact: "સંબંધ નંબર",
      buyerPlaceholderCity: "શહેર",
      buyerPlaceholderPostal: "પોસ્ટલ કોડ",
      orderTimelineTitle: "ઓર્ડર સમયરેખા",
      orderStep1: "ખરીદાર ઓર્ડર સબમિટ કરે છે",
      orderStep2: "એડમિન ફાર્મ સ્ટોક ચકાસે છે",
      orderStep3: "ફાર્મ ડિસ્પેચ તારીખ પુષ્ટિ કરે છે",
      orderStep4: "એડમિન અંતિમ ડિલિવરી શેર કરે છે",
      currentEta: "વર્તમાન ઇટીએ",
      etaPending: "ફાર્મ પુષ્ટિ બાકી",
      agreementNote: "ઓર્ડર મૂકવા પર, તમે અમારી શરતો અને ગોપનીયતા નીતિ સાથે સહમત છો.",
      submitOrder: "ઓર્ડર વિનંતી સબમિટ કરો",
    },
    farm: {
      pageTitle: "ફાર્મ માલિક ડેસ્ક",
      pageSubtitle: "ફાર્મ ભૂમિકા: સ્ટોકને ચોક્કસ રાખો, ઉત્પાદનને ઉપલબ્ધ/અનુપલબ્ધ તરીકે નિર્દેશ કરો, અને અપેક્ષિત ડિસ્પેચ તારીખો એડમિનને મોકલો.",
      profileTitle: "ફાર્મ પ્રોફાઇલ",
      stockControlTitle: "મારો સ્ટોક કંટ્રોલ",
      dispatchTitle: "એડમિનને ડિસ્પેચ તારીખ અપડેટ",
      farmLabel: "ફાર્મ:",
      ownerLabel: "માલિક:",
      locationLabel: "સ્થળ:",
      contactLabel: "સંપર્ક:",
      listingLabel: "લિસ્ટિંગ",
      gradeLabel: "ગ્રેડ",
      availableStockLabel: "ઉપલબ્ધ સ્ટોક:",
      markAvailable: "ઉપલબ્ધ કરો",
      updateStock: "સ્ટોક અપડેટ કરો",
      markUnavailable: "અનુપલબ્ધ કરો",
      sendToAdmin: "એડમિનને મોકલો",
    },
    account: {
      title: "એકાઉન્ટ",
      subtitle: "ખરીદાર, એડમિન અને ફાર્મ માલિક ભૂમિકાઓ માટે Gmail આધારિત સાઇન-ઇન.",
      roleGuide: "ભૂમિકા ઍક્સેસ માર્ગદર્શિકા",
      buyerLine: "ખરીદાર: થોક ફળ-શાકભાજી ઓર્ડર કરો અને ડિલિવરી ટ્રેક કરો.",
      adminLine: "એડમિન: ખરીદાર ઓર્ડર તપાસો, ફાર્મ પસંદ કરો અને અંતિમ ડિલિવરી તારીખ નક્કી કરો.",
      farmLine: "ફાર્મ માલિક: સ્ટોક લેવલ અને અપેક્ષિત ડિસ્પેચ તારીખ અપડેટ કરો.",
      gmailLine: "રજિસ્ટ્રેશન માટે Gmail અથવા Continue With Google નો ઉપયોગ કરો.",
      paymentSuccess: "ચુકવણી સફળતાપૂર્વક પૂર્ણ થઈ ગઈ છે. આપનો ઓર્ડર સ્ટેટસ ટૂંકમાં અપડેટ થશે.",
      checkoutCancelled: "ચેકઆઉટ રદ કરવામાં આવ્યો હતો. તમે તમારા કાર્ટમાંથી તેને ફરીથી પ્રયત્ન કરી શકો છો.",
      signInPrompt: "કૃપા કરીને સાઇન ઇન કરો જેથી તમે સુધી પહોંચી શકો",
      configError: "કોન્ફિગરેશન અધૂરી છે. Supabase ઇન્વ સલાહ સેટ કરો અને ફરી પ્રયાસ કરો.",
    },
    auth: {
      signedIn: "સાઇન ઇન",
      signOut: "સાઇન આઉટ",
      signIn: "સાઇન ઇન",
      signUp: "સાઇન અપ",
      fullName: "પૂર્ણ નામ",
      surname: "ઉપનામ (વૈકલ્પિક)",
      emailAddress: "ઈમેલ સરનામું",
      gmailAddress: "Gmail સરનામું",
      otpCode: "ઓટીફી કોડ",
      requestOtp: "ઓટીફી મોકલો",
      verifyOtp: "ઓટીફી ચકासો",
      otpSent: "ઓટીફી બનાવવામાં આવ્યો. કોડ માટે તમારું ઈમેલ તપાસો.",
      otpVerified: "ઓટીફી માન્ય છે. તમે હમણાં સહીન કરી ચુક્યા છો.",
      otpRequired: "ઓટીફી કોડ જરૂરી છે.",
      otpAttemptRemaining: "{count} પ્રયાસો બાકી છે.",
      otpMaxAttemptsReached: "ઓટીફી પ્રયત્નોની મર્યાદા પૂર્ણ થઈ ગઈ.",
      otpMaxAttemptsHelp: "15 મિનિટ માટે ખાતુ લોક થઈ ગયું છે; support@bhavnagarstore.com સાથે સંપર્ક કરો.",
      otpResendCooldown: "નવો ઓટીફી માંગવા પહેલાં કૃપા કરીને રાહ જુઓ",
      authHelpText: "ઇમેઇલ ઓટીફી સાથે સાઇન ઇન/અપ કરો. તાત્કાલિક લૉકઆઉટ પહેલાં 3 પ્રયાસો.",
      otpBeforeGoogle: "પહેલા ઓટીફી માંગો.",
      otpVerifyRequired: "આગળ વધવાની પહેલા ઓટીફી ચકાસો.",
      otpAuthSignInFailed: "ઓટીફી માન્ય છે, પરંતુ પાસવર્ડ સાઇન-ઇન નિષ્ફળ થયું.",
      fullNameRequired: "સાઇન અપ માટે સંપૂર્ણ નામ આવશ્યક છે.",
      password: "પાસવર્ડ",
      createAccount: "એકાઉન્ટ બનાવો",
      pleaseWait: "કૃપા કરીને રાહ જુઓ...",
      continueGoogle: "Google સાથે ચાલુ રાખો",
      continueWithGoogleTitle: "Google સાથે ચાલુ રાખો",
      continueWithGoogleSubtitle: "ઝડપી સાઇન-ઈન માટે Google નો ઉપયોગ કરો.",
      googleOAuthHint: "સુનિશ્ચિત કરો કે Supabase માં Google OAuth સક્ષમ છે અને રીડાયરેક્ટ URL માં તમારો ડોમેન સમાવિષ્ટ છે.",
      checkAccount: "જાંચો કે આ ઇમેલ અગાઉથી નોંધાયેલ છે",
      checkingAccount: "ખાતા તપાસી રહ્યું છે…",
      accountExists: "ખાતું મળી ગયું. તમે Google સાથે સાઇન ઇન કરી શકો છો.",
      accountNotFound: "આ ઇમેલ માટે કોઈ ખાતું મળ્યું નથી. કૃપા કરીને પહેલાં સાઇન અપ કરો.",
      enterEmailToCheck: "Google સાઇન-ઇન સક્ષમ કરવા માટે તમારું ઇમેલ દાખલ કરો અને તપાસો બટન પર ક્લિક કરો.",
      roleLabel: "ભૂમિકા",
      roleBuyer: "ખરીદાર",
      roleAdmin: "એડમિન",
      roleFarm: "ફાર્મ માલિક",
      recentOrders: "તાજેતરના ઓર્ડર",
      noRecentOrders: "તાજેતરમાં કોઈ ઓર્ડર નથી.",
      gmailOnlyHint: "તમારું ઇમેલ સરનામું દાખલ કરો અને ઓટીફી ચકાસો.",
      cancel: "રદ કરો",
      signedInSuccess: "સફળતાપૂર્વક સાઇન ઇન થયું.",
      signedOutSuccess: "સાઇન આઉટ થયું.",
      signupSuccess: "એકાઉન્ટ બની ગયું. જો સક્ષમ હોય તો ચકાસણી ઇમેઇલ જુઓ.",
      emailInvalidError: "આગળ વધવા માટે માન્ય ઈમેલ સરનામું વાપરો.",
      gmailOnlyError: "આગળ વધવા માટે માન્ય ઈમેલ સરનામું વાપરો.",
      authFailed: "પ્રમાણીકરણ નિષ્ફળ ગયું.",
    },
  },
};

export function normalizeLanguage(value: string | undefined): AppLanguage {
  if (value === "hi" || value === "gu") {
    return value;
  }
  return "en";
}
