<template>
    <v-app>
        
        <div class="container">
            <!-- <div class="test">test</div> -->
            <!-- <span class="item item1">item1</span>
            <span class="item item2">item2</span>
            <span class="item item3">item3</span>   -->
            <div class="InputBox">
                <v-card class="mx-auto px-6 py-8" max-width="344">
                    <v-form
                        v-model="form"
                        @submit.prevent="onSubmit"
                    >
                        <v-text-field
                        v-model="email"
                        :readonly="loading"
                        :rules="[required]"
                        class="mb-2"
                        clearable
                        label="Email"
                        ></v-text-field>

                        <v-text-field
                        v-model="password"
                        :readonly="loading"
                        :rules="[required]"
                        clearable
                        label="Password"
                        placeholder="Enter your password"
                        ></v-text-field>

                        <br>

                        <v-btn
                        :disabled="!form"
                        :loading="loading"
                        block
                        color="success"
                        size="large"
                        type="submit"
                        variant="elevated"
                        >
                        Sign In
                        </v-btn>
                    </v-form>
                </v-card>

            </div>





        </div>
        
    </v-app>
</template>

<script lang="ts">
  export default {
    data: () => ({
      form: false,
      email: null,
      password: null,
      loading: false,
    }),

    methods: {
      onSubmit () {
        if (!this.form) return

        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
        console.log(this.$data)
      },
      required (v) {
        console.log(v)
        return !!v || 'Field is required'
      },
    },
  }
</script>


<style scoped>
.container{
    /* background setting */
    width: 40%;
    height: 100%;
    border:solid 10px red;
    background-color: black;
    /* flex box setting */
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
    justify-content: space-evenly;
    align-items: center;
}

.container .item{
    line-height: 3em;
    background-color: blue;
    color: white;
    width: 100px;
    height: 100px;
    text-align: center;
    border: 10px solid pink;
    border-radius: 10px;
}
.container .InputBox{
    width: 60%;
    height: 45%;
    margin-top: 60%;
    padding: 10px 10px;
    /* background-color: tomato; */
}


</style>