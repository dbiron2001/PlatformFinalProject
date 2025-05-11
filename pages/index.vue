<template>
    <header>
        <div class="flex flex-col items-center w-full pt-8 pb-8 font-fredoka">
            <h1 class="mb-4 text-4xl font-bold fun-title">Campus Navigator</h1>
            <input type="text"  placeholder="Search room number..."
                   class="w-full max-w-md p-3 border-2 rounded-lg bg-neutral-200 focus:border-neutral-400 focus:outline-none">
        </div>
    </header>
    <main class="w-full mt-8 font-fredoka">
        <div class="flex items-center justify-center">
            <div class="grid grid-cols-3 gap-8 cursor-pointer w-62">
                <NuxtLink to="/vsu_dcst">
                    <div class="flex flex-col items-center w-64 space-y-2 shadow-xl h-52 hover:scale-110 rounded-xl">
                        <img src="/assets/images/buildingA.jpg" alt="dcst picure" class="object-cover rounded-lg h-44">
                        <span>DCST BUILDING</span>
                    </div>
                </NuxtLink>
                <NuxtLink to="/vsu_library">
                    <div class="flex flex-col items-center w-64 space-y-2 shadow-xl cursor-pointer h-52 hover:scale-110 rounded-xl">
                        <img src="/assets/images/buildingA.jpg" alt="dcst picure" class="object-cover rounded-lg h-44">
                        <span>IHK BUILDING</span>
                    </div>
                </NuxtLink>
                <NuxtLink to="/vsu_ihk">
                    <div class="flex flex-col items-center w-64 space-y-2 shadow-xl cursor-pointer h-52 hover:scale-110 rounded-xl">
                        <img src="/assets/images/buildingB.jpg" alt="dcst picure" class="object-cover rounded-lg h-44 ">
                        <span>LIBRARY BUILDING</span>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </main>
</template>
<!-- v-model="searchQuery"-->
 <style>
    /* * {
        outline: red solid 1px;
    } */
</style>