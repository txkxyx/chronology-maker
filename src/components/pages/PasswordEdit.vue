<template>
    <q-layout>
        <q-page-container>
            <q-page>
                <div class="row justify-center">
                    <div class="col-md-auto text-center">
                        <h3 class="text-center">パスワード変更</h3>
                        <q-form @submit="submitPassword" class="q-gutter-md">
                            <span class="text-negative" v-if="errorMessage != ''">{{errorMessage}}</span>
                            <q-input class="q-mb-md" v-model="password" label="新しいパスワード" type="password"/>
                            <q-input class="q-mb-md" v-model="passwordConf" label="新しいパスワード確認用" type="password"/>
                            <div class="text-center">
                                <q-btn absolute-center type="submit" color="primary" label="パスワード変更"/>
                            </div>
                        </q-form>
                    </div>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>
<script>
import firebase from "firebase"
import store from "../../store"

export default {
    name: "PasswordEdit",
    data(){
        return{
            errorMessage: "",
            password: "",
            passwordConf: ""
        }
    },
    methods:{
        submitPassword(){
            if(this.password === this.passwordConf){
                firebase.auth().currentUser.updatePassword(this.password).then(() => {
                    firebase.auth().signOut().then(() => {
                        // ストアの情報をログアウト状態にする
                        store.dispatch('updateStatus', false)
                        store.commit('setAuth', {})
                        // ログイン画面に遷移
                        this.$router.push('/auth/signin')
                    })
                }).catch(err => {
                    console.log(err)
                    this.errorMessage = err
                })
            }else{
                this.errorMessage = "確認用パスワードが異なります"
            }
        }
    }
}
</script>