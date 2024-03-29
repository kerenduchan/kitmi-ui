import colors from 'vuetify/lib/util/colors'

// light theme
const light = {
    dark: false,
    colors: {
        background: colors.shades.white,
        surface: colors.grey.lighten4,
        'surface-darken': colors.grey.lighten2,
        primary: colors.blueGrey.darken3,
        secondary: '#d6dbdf',
        'secondary-1': colors.blue.base,
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
        'expense': colors.red.lighten2,
        'income': colors.grey.darken3,
        'excluded': colors.grey.base,
        'highlight': colors.amber.lighten4,
        'link': colors.blue.darken2
    }
}

// dark theme
const dark = {
    dark: true,
    colors: {
        background: colors.shades.black,
        surface: colors.grey.darken4,
        'surface-darken': colors.grey.darken4,
        primary: colors.blueGrey.darken3,
        secondary: colors.grey.darken2,
        'secondary-1': colors.grey.base,
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
        'expense': colors.red.lighten2,
        'income': colors.grey.lighten1,
        'excluded': colors.grey.darken2,
        'highlight': colors.orange.base,
        'link': colors.blue.base
    }
}

const theme = {
    themes: {
        light,
        dark
    },
    defaultTheme: 'light'
}

export default theme