<script setup>
import { ref } from 'vue'

const props = defineProps({
    links: Object
})

const rail = ref(true)

</script>

<template>
    <v-navigation-drawer :rail="rail" permanent :width="190">
        <v-list>

            <!-- expand/collapse navigation drawer -->
            <v-list-item>
                <v-list-item-title>
                    <v-btn class="rounded-0" elevation="0" variant="text"
                        :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" @click.stop="rail = !rail" />
                </v-list-item-title>
            </v-list-item>

            <!-- nav links -->
            <v-list-item v-for="link in links" :key="link.name" router :to="link.path">
                <template v-slot:prepend>
                    <v-tooltip :disabled="!rail" :text="link.title">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props">{{ link.icon }}</v-icon>
                        </template>
                    </v-tooltip>
                </template>
                <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item>

        </v-list>
    </v-navigation-drawer>

</template>