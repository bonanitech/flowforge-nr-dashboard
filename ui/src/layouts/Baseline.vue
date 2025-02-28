<template>
    <v-app class="nrdb-app nrdb-app--baseline">
        <v-app-bar :elevation="1">
            <template #prepend>
                <v-app-bar-nav-icon @click="drawer = !drawer" />
            </template>
            <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>
        </v-app-bar>

        <v-main>
            <v-navigation-drawer v-model="drawer">
                <v-list nav>
                    <v-list-item
                        v-for="page in orderedPages" :key="page.id" active-class="v-list-item--active"
                        prepend-icon="mdi-home" :title="`${page.name} (${page.route.path})`"
                        :to="{name: page.route.name}" link
                    />
                </v-list>
            </v-navigation-drawer>
            <slot class="nrdb-layout" />
        </v-main>
    </v-app>
</template>

<script>
import { mapState } from 'vuex'

/**
 * Convert a hex to RGB color
 * @param {String(hex)} hex
 */
function hexToRgb (hex) {
    const bigint = parseInt(hex.replace('#', ''), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
}

/**
 * Given a hex color code to represent a bg, return an appropriately contrasting text color
 * @param {String(hex)} bg
 */
function getContrast (bg) {
    const bgRgb = hexToRgb(bg)

    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(((parseInt(bgRgb[0]) * 299) +
                        (parseInt(bgRgb[1]) * 587) +
                        (parseInt(bgRgb[2]) * 114)) / 1000)

    const textColor = (brightness > 125) ? '#000000' : '#ffffff'
    return textColor
}

export default {
    name: 'BaslineLayout',
    props: {
        pageTitle: {
            type: String,
            default: 'Page Title Here'
        }
    },
    data () {
        return {
            drawer: false
        }
    },
    computed: {
        ...mapState('ui', ['pages', 'themes']),
        theme: function () {
            const page = this.pages[this.$route.meta.id]
            const theme = this.themes[page.theme].colors
            return theme
        },
        orderedPages: function () {
            return Object.values(this.pages).sort((a, b) => a.order - b.order)
        }
    },
    watch: {
        theme: function () {
            this.updateTheme()
        }
    },
    mounted () {
        this.updateTheme()
    },
    methods: {
        go: function (name) {
            this.$router.push({
                name
            })
        },
        updateTheme () {
            const theme = this.$vuetify.theme.themes.nrdb.colors
            // convert NR Theming to Vuetify Theming
            theme.surface = this.theme.surface
            // primary bg
            theme.primary = this.theme.primary
            // primary font - auto calculated
            theme['on-primary'] = getContrast(this.theme.primary)
            // UI Background
            theme.background = this.theme.bgPage
            // Group Background
            theme['group-background'] = this.theme.groupBg
            theme['group-outline'] = this.theme.groupOutline
        }
    }
}
</script>
