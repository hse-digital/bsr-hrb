import { AccountablePersonModel } from "../services/application.service";

export class SummaryComponent {
  protected ap!: AccountablePersonModel;
  protected apIndex!: number;
  protected hasMoreAp = false;

  get apAddress() {
    return this.ap.PapAddress ?? this.ap.Address;
  }

  sectionsWithAccountability() {
    return this.ap.SectionsAccountability?.filter(x => x.Accountability?.length ?? 0 > 0);
  }

  notPap() {
    return this.ap.IsPrincipal == 'no';
  }

  isRegisteringFor() {
    return this.ap.Role == 'registering_for';
  }

  isNamedContact() {
    return this.ap.Role == 'named_contact';
  }

  isEmployee() {
    return this.ap.Role == 'employee';
  }

}
