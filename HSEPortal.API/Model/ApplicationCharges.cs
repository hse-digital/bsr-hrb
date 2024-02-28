namespace HSEPortal.API.Model
{
    public class ApplicationCharges
    {
        public double ApplicationCost { get; set; }

        public CertificateCharges CertificateCharges { get; set; }
    }

    public class CertificateCharges
    {
        public double ApplicationCharge { get; set; }

        public double PerPersonPerHourCharge { get; set; }
    }
}
