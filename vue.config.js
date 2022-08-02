module.exports = {
    lintOnSave: false,
    // pluginOptions: {
    //     builderOptions: {
    //         extraFiles: [
    //             {
    //                 from: "./SumatraPDF.exe",
    //                 to: "SumatraPDF.exe",
    //             },
    //
    //         ],
    //         extraResources: [
    //             {from: 'SumatraPDF.exe', to: './'},
    //             {from: './SumatraPDF.exe', to: './'},
    //         ],
    //     },
    //     electronBuilder: {
    //         nodeIntegration: true
    //     }
    //
    // },
    // pluginOptions: {
    //     electronBuilder: {
    //         builderOptions:{
    //             extraResources: [
    //                 {from:'./facture',to:'./'},
    //                 {from:'facture',to:'./'},
    //             ],
    //         },
    //         nodeIntegration:true,
    //     }
    // },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: "Express Store",
                appId: 'express_store.com',
                win: {
                    "target": [
                        "nsis"
                    ],
                    icon: 'public/icon.ico',
                    // "requestedExecutionLevel": "requireAdministrator"
                },
                nsis: {
                    "installerIcon": "public/icon.ico",
                    "uninstallerIcon": "public/icon.ico",
                    "oneClick": false,
                    "allowToChangeInstallationDirectory": true
                },
                files: [
                    "**/*"
                ],
                extraFiles: [
                    {
                        "from": "facture",
                        "to": "facture",
                        "filter": ["**/*"]
                    },
                    {
                        "from": "SumatraPDF.exe",
                        "to": "SumatraPDF.exe",
                        "filter": ["**/*"]
                    }
                ]
            }
        }
    },
    transpileDependencies: [
        'vuetify'
    ]
}
