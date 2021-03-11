import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
@Module({ namespaced: true})
class User extends VuexModule {
  public contractAddress: string = ''
  public isOwner: boolean = false

  @Mutation
  public setContract(contractAddress: string): void {
    contractAddress.replaceAll(/\s/g,'')
    this.contractAddress = contractAddress
  }
  @Mutation
  public setOwner(isOwner: boolean): void {
    this.isOwner = isOwner
  }

  @Action({ rawError: true })
  public updateContract(contractAddress: string): void {
    this.context.commit('setContract', contractAddress)
  }
  @Action({ rawError: true })
  public updateOwner(isOwner: boolean): void {
    this.context.commit('setOwner', isOwner)
  }
}
export default User