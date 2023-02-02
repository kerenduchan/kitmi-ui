<template>
    <div class="mx-5 mb-5 flex-grow-1 d-flex flex-column overflow-y-hidden rounded">
        <div class="flex-grow-1 overflow-y-auto">
            <slot name="main"/>
        </div>
        <div class="d-flex justify-center bg-primary">
            <slot name="footer" />
        </div>
    </div>
</template>