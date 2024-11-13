export const settings = {
    app: {
        name: "VITAR",
        version: "1.0.0",
        description: "CRM & Calibration Portal",
        apiVersion: "v1",
        supportEmail: "ask@pixelcareconsulting.com"
    },
    theme: {
        skin: "light",
        primaryColor: "#FF0000",
        secondaryColor: "#CC0000",
        fontFamily: "Inter, sans-serif"
    },
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        timeout: 30000, // 30 seconds
    },
    features: {
        darkMode: true,
        notifications: true,
        analytics: process.env.NODE_ENV === 'production'
    },
    defaults: {
        language: "en",
        currency: "USD",
        dateFormat: "DD/MM/YYYY"
    }
};
export default { settings };
