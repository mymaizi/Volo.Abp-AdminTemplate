import Vue from 'vue'
import Vuex from 'vuex'
import {environment} from "./environment"
import axios from "axios"
import qs from "qs"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:window.sessionStorage.getItem("token"),
    appConfigs:{}
  },
  mutations: {
    setToken:(state,payload)=>{
      state.token=payload.token;
      window.sessionStorage.setItem("token",payload.token); 
    },
    setAppConfigs:(state,payload)=>{
      state.appConfigs=payload.appConfigs;
    }
  },
  actions:{
    login({ commit, state },payload){
      return new Promise((resolve, reject)=>{
        let formData={
          grant_type: "password",
          scope: environment.oAuthConfig.scope,
          client_id:environment.oAuthConfig.clientId,
          client_secret:environment.oAuthConfig.clientSecret
        }
        Object.assign(formData,payload);
        axios.post(`${environment.oAuthConfig.issuer}/connect/token`,qs.stringify(formData)).then(function(response){
          commit("setToken", { token: `${response.data.token_type} ${response.data.access_token}` });
          resolve(response);
        }).catch(function(error){
          reject(error);
        });
      })
    },
    getAppConfigs({ commit, state },payload){
      axios.get(`${environment.apis.default.url}/api/abp/application-configuration`).then(function(response){
        commit("setAppConfigs",{appConfigs:response.data})
      });
    }
  }
})
