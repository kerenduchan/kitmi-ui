<script setup>
import moment from 'moment'
import { ref, computed } from 'vue'

// components
import Snackbar from '@/components/Snackbar.vue'
import StackedBarChart from '@/components/charts/StackedBarChart.vue'

// composables
import snackbar from '@/composables/snackbar'
import getSummary from '@/composables/queries/getSummary'

// snackbar
const { showSnackbar, snackbarText, displaySnackbar } = snackbar()

// Labels for the x-axis
const xaxis = ref(null)

// Did the data arrive from the server
const isReady = ref(false)

// The stacked data (y-axis values) for the bar chart
const series = ref(null)

// start date (v-model for input)
const startDate = ref("2022-01-01")

// end date (v-model for input)
const endDate = ref("2022-12-31")

// group by category/subcategory = v-model for the v-select
const groupBy = ref('category')

const params = computed(() => {
    return {
        groupBy: groupBy.value,
        startDate: startDate.value,
        endDate: endDate.value,
    }
})

const { onResult, refetch } = getSummary(params.value)

onResult(queryResult => {
    if (queryResult && queryResult.data) {
        const summary = queryResult.data.summary
        xaxis.value = summary.xAxis
        series.value = summary.groups
        isReady.value = true

    }
})

function refetchData() {

    if (!isValidDate(startDate.value)) {
        displaySnackbar('Start date is not valid.')
        return
    }

    if (!isValidDate(endDate.value)) {
        displaySnackbar('End date is not valid.')
        return
    }

    if (countMonths() > 12) {
        displaySnackbar('Date range should be no greater than one year.')
        return
    }
    console.log('refetch data ' + startDate.value + ' ' + endDate.value)
    isReady.value = false


    refetch(params.value)
}

function isValidDate(str) {
    const d = new Date(str)
    return moment(str, "YYYY-MM-DD", true).isValid() && (d.getFullYear() > 2010)
}

function countMonths() {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)

    console.log(end.getMonth() + ' ' + end.getFullYear())
    return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth()
}

</script>

<template>
    <div class="top-bar">
    </div>
    <v-divider />

    <form>
        <div>
            <label for="start">Start date:</label>
            <input type="date" id="start" v-model="startDate">
        </div>
        <div>
            <label for="end">End date:</label>
            <input type="date" id="end" v-model="endDate">
        </div>

        <!-- Group by category/subcategory -->
        <v-select label="Group By" :items="['category', 'subcategory']" v-model="groupBy" />

        <v-btn @click="refetchData">Refresh</v-btn>
    </form>

    <!-- the stacked bar chart -->
    <StackedBarChart v-if="isReady" :xaxis="xaxis" :series="series" />

    <!-- snackbar -->
    <Snackbar :show="showSnackbar" :text="snackbarText" @close="showSnackbar = false" />

</template>
