<script setup>

// components
import ActionsBar from '@/components/layout/ActionsBar.vue'
import Actions from '@/components/layout/Actions.vue'
import ViewContent from '@/components/layout/ViewContent.vue'
import ViewContentTitle from '@/components/layout/ViewContentTitle.vue'
import ViewContentMain from '@/components/layout/ViewContentMain.vue'

</script>

<template>
    <!-- actions bar at the top -->
    <ActionsBar>
        <Actions />
    </ActionsBar>

    <!-- content, below the actions bar -->
    <ViewContent>

        <!-- content title -->
        <ViewContentTitle text="Home" />

        <!-- content body -->
        <ViewContentMain>
            Welcome to Kitmi!
        </ViewContentMain>
    </ViewContent>

</template>
