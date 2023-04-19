module.exports = {
  packagerConfig: {
    icon: './images/icon@1x.ico'
  },
  rebuildConfig: {},
  // 配置github发布者
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'github-user-name',
          name: 'github-repo-name',
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        certificateFile: './cert.pfx',
        iconUrl: './images/icon@1x.ico',
        setupIcon: './images/icon@1x.ico',
        certificatePassword: process.env.CERTIFICATE_PASSWORD,
      },
    },

    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    // Linux
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './images/icon.png'
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      // MAC
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './images/icon.icns'
      },
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        icon: './images/icon@1x.ico'
      },
    },
  ],
}
