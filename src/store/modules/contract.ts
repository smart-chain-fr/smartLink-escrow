import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
@Module({ namespaced: true })
class Contract extends VuexModule {
  public contractAddress: string = ''
  public slashingRate: number = 0

  @Mutation
  public setContract(contractAddress: string): void {
    contractAddress.replaceAll(/\s/g, '')
    this.contractAddress = contractAddress
  }
  @Mutation
  public setSlashingRate(slashingRate: number): void {
    this.slashingRate = slashingRate
  }

  @Action({ rawError: true })
  public updateContract(contractAddress: string): void {
    this.context.commit('setContract', contractAddress)
  }
  @Action({ rawError: true })
  public updateSlashingRate(slashingRate: number): void {
    this.context.commit('setSlashingRate', slashingRate)
  }
}
export default Contract