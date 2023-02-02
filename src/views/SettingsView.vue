<script setup>
import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'
import ActionsBar from '@/components/layout/ActionsBar.vue'
import Actions from '@/components/layout/Actions.vue'
import ViewContent from '@/components/layout/ViewContent.vue'
import ViewContentTitle from '@/components/layout/ViewContentTitle.vue'

const theme = useTheme()

const appearance = ref(theme.global.current.value.dark ? 'dark' : 'light')

watch(appearance, () => {
    theme.global.name.value = appearance.value
})

</script>

<template>
    <!-- actions bar at the top -->
    <ActionsBar>
        <Actions />
    </ActionsBar>

    <!-- content, below the actions bar -->
    <ViewContent>

        <!-- content title -->
        <ViewContentTitle text="Settings" />

        <!-- content body -->
        Appearance: 
        <v-radio-group v-model="appearance">
            <v-radio label="Light" value="light" />
            <v-radio label="Dark" value="dark" />
        </v-radio-group>
    </ViewContent>
</template>