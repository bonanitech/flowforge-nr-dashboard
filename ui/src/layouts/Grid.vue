<template>
    <BaselineLayout :page-title="$route.meta.title">
        <div v-if="gridGroups" class="nrdb-layout--grid">
            <div v-for="g in gridGroups" :key="g.id" :style="`grid-column-end: span ${ g.width }`">
                <v-card variant="outlined" class="bg-group-background">
                    <template v-if="g.disp" #title>
                        {{ g.name }}
                    </template>
                    <template #text>
                        <div class="nr-db-layout-group--grid" :style="`grid-template-columns: repeat(${ g.width }, 1fr); grid-template-rows: repeat(${g.height}, minmax(${rowHeight}, auto)); `">
                            <div v-for="w in widgetsByGroup(g.id)" :key="w.id" style="display: grid" :style="`grid-template-rows: repeat(${w.props.height}, minmax(${rowHeight}, auto)); grid-column-end: span ${ w.props.width || g.width }`">
                                <component :is="w.component" :id="w.id" :props="w.props" :state="w.state" :style="`grid-row-end: span ${w.props.height}`" />
                            </div>
                        </div>
                    </template>
                </v-card>
            </div>
        </div>
    </BaselineLayout>
</template>

<script>
// eslint-disable-next-line import/order
import BaselineLayout from './Baseline.vue'
// eslint-disable-next-line import/order, sort-imports
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'LayoutGrid',
    components: {
        BaselineLayout
    },
    data () {
        return {
            columns: 12,
            rowHeight: '48px'
        }
    },
    computed: {
        ...mapState('ui', ['groups', 'widgets']),
        ...mapGetters('ui', ['groupsByPage', 'widgetsByGroup']),
        gridGroups: function () {
            const groups = this.groupsByPage(this.$route.meta.id)
            return groups
        }
    }
}
</script>

<style scoped>

@import "./grid-groups.css";

.nrdb-layout--grid {
    --layout-card-width: 320px;
    --layout-gap: 12px;
    --widget-row-height: 48px;
}
.nrdb-layout--grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    flex-wrap: wrap;
    padding: var(--layout-gap);
    gap: var(--layout-gap);
}

.nrdb-layout--grid > div {
    width: 100%;
    /* max-width: 100%; */
}

.v-card {
    width: 100%;
}

@media only screen and (max-width: 1024px) {
    .nrdb-layout--grid {
        grid-template-columns: repeat(9, 1fr);
    }
}

@media only screen and (max-width: 768px) {
    .nrdb-layout--grid {
        grid-template-columns: repeat(6, 1fr);
    }
}

</style>
