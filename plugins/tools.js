/**
 * Install plugin
 * @param Vue
 * @param _
 * @param qs
 */
function plugin(Vue,_,qs) {
  if (plugin.installed) {
    return
  }
  plugin.installed = true;
  let grantedPolicies= window.sessionStorage.getItem("grantedPolicies");
  Object.defineProperties(Vue.prototype, {
    $allowVisible: {
      get() {
        return function(role){
          let _grantedPolicies=qs.parse(grantedPolicies);
          let flag=false;
          if(_.isArray(role)){
            _.forIn(_grantedPolicies,function(value,key){
                let sk=_.split(key,'.');
                if(_.intersection(role,sk).length>0){
                  flag=true;
                  return
                }
            })
          }
          else if(_.isString(role)){
            let r={};
            r[role]="true";
            flag=_.isMatch(_grantedPolicies,r);
          }
          return flag; 
        }          
      }
    }
  })
}
export default plugin