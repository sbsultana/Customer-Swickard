import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { ApiService } from 'src/app/_providers/api-service/api.service';
import { Location } from '@angular/common';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from '../Core/Providers/api-service/api-service.service'
import { DatePipe } from '@angular/common'
import { NgxCaptureService } from "ngx-capture";
import { map, tap } from "rxjs/operators";
import html2canvas from 'html2canvas';
// import { saveAs } from 'file-saver';
// import * as FileSaver from 'file-saver';
import { saveAs as fileSaverSave } from 'file-saver'



@Component({
  selector: 'app-cancellation-request-form',
  templateUrl: './cancellation-request-form.component.html',
  styleUrls: ['./cancellation-request-form.component.scss']
})
export class CancellationRequestFormComponent implements OnInit {
  @ViewChild("screen", { static: false }) screen: ElementRef;

  public ActualDecodeparam: string;
  ReportUserId = null;
  ReportId = null;
  ReportDate = null;
  TabChange = '0';
  CollectInfo = 'N';
  otherText = 'N';
  mindate: any;
  VehicleDet: FormGroup;
  ReasonsForCancel: FormGroup;
  ContractType: FormGroup;
  RefundDet: FormGroup;
  submitted: boolean = false;
  UploadedFile: any;
  phoneFormat: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  ancillary = 'N';
  uploadcontract: any
  DocumentfileName = null;
  ContractFileName = null;
  ContractName: any;
  cancel: any;
  contract: any;
  vehicleyear: any = [];
  vehiclemake: any = [];
  vehiclemodel: any = [];
  stores: any = [];
  states: any = [];
  responceContent: any;
  public message: boolean = false;
  statusresult: boolean = false;
  statusform: boolean = false;
  // vinPattern = "^[a-zA-Z0-9]+$";
  // zipPattern = "^[0-9]+$"
  appfee: any;
  status: boolean;
  cancellationData: any[];
  vinlastname: any = '';
  refid: any = '';
  Loan: any;
  pwcvalue: any;
  expedited: boolean;
  checkStatus: any;
  statusalertmsg: boolean;
  warningMessage: string;
  Requeststatus: string;
  confirmation: boolean = false;
  confirmationPopup: boolean;
  Save: boolean;
  Edit: boolean
  dtofcnclton: string;
  dtofcntrct: string;
  ContractFile: any;
  ReasonFile: any;
  outstandingLoan: string;
  cancellationstatus: any;

  @ViewChild('closeBtn') closeBtn: ElementRef;
  selectedstorename: any;
  selectedyearname: any;
  selectedmakename: any;
  selectedmodelname: any;
  selectcontractname: any;
  selectedstatename: any;
  Fulldet: boolean;
  storeemail: any;
  constructor(private captureService: NgxCaptureService, private location: Location, private fB: FormBuilder, private api: ApiServiceService, private datepipe: DatePipe,  private router: Router,) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let currentUrl = event.url;
        console.log(currentUrl);
        if (currentUrl.includes('/s')) {
          this.Edit = true;
          this.Fulldet = true;
           this.openform(currentUrl.substring(2));
           
        }
      else if (currentUrl.length > 1) {
          this.Edit = true;
          this.Fulldet = false;

          this.openform(currentUrl)
        }
        else {
          this.Save = true
        }
      };
    });

    this.VehicleDet = this.fB.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      emailid: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}$'),]],
      mtdofcontact: [''],
      sellingDealership: ['', [Validators.required]],
      contract: [''],
      vin: ['', [Validators.required, Validators.minLength(17)]],
      year: [''],
      make: [''],
      model: [''],
      dateOfContract: [''],
      dateOfCancellation: [''],
      mileage: [''],
    });
    this.ReasonsForCancel = this.fB.group({
      customerRequest: [''],
      SalesDeal : [''],
      vehicleSold: [''],
      repossession: [''],
      satisfiedLien: [''],
      totalLossofVehicle: [''],
      other: [''],
      otheretext: [''],
      upload: [''],
      dealercancellation:[''],

    });
    this.ContractType = this.fB.group({
      type: ['0'],
      vehicleServiceContract: [''],
      gap: [''],
      ancillary: [''],
      ancillaryType: [''],
      uploadContract: [''],

    });
    this.RefundDet = this.fB.group({
      contractOwner: [''],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      loanleasedet:[''],
      ach: [''],
      bankName: [''],
      routing: ['', [Validators.minLength(10)]],
      acct: [''],
      outstandingLoan: [''],
      finame:[''],
      acnumber:[''],
      reqExpedited: [''],
      approveExpedited: [''],
      agreeCancellationTerms: [''],
      customerSignchk: [''],
      customersign: [''],
      acknowledge: [''],
    });


  }
  Today;
  ngOnInit() {
    //  this.router.navigate(['cancellationsubmission'])
    //  this.message=true
    //  this.responceContent = "Your Cancellation request submitted successfully. Please use Ref # " +" for future communications"
    // this.statusresult=true
    // this.status=true
    // this.submitted=true
  
    this.selectedstorename = 'SELECT'
    this.selectedyearname = 'SELECT'
    this.selectedmakename = 'SELECT'
    this.selectedmodelname = 'SELECT'
    this.selectcontractname = 'SELECT'
    this.selectedstatename = 'SELECT'
    this.ContractType.controls.gap.setValue('');
    this.VehicleDet.controls.sellingDealership.setValue('');

    console.log(this.VehicleDet.value)
    this.Requeststatus = ''
    this.checkStatus = false;
    this.expedited = true;
    this.uploadcontract = ''

    this.getyear();
    this.getstores();
    this.getStates()
//  this.getstoreswithemails();
    // console.log(document.getElementsByName('cancellation')[0])
    // console.log(document.getElementsByName('cancellation'))
    if (this.Save == true) {
      setTimeout(() => {
        var today = new Date().toISOString().split('T')[0];
        var dt = new Date(today)
        dt.setMonth(dt.getMonth() - 3)
        this.Today = dt.toISOString().split('T')[0]
        console.log(this.Today);
        document.getElementsByName("cancellation")[0].setAttribute('min', this.Today);

      }, 1000);
    }
   
  }
  download(){
     let fileName= 'https://swickardapi.axelautomotive.com/api/resources/images/'+this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE;  
     fileSaverSave(fileName, this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE);   
  }
 
  gap(e) {
    if (e.target.checked) {
      // this.RefundDet.controls.outstandingLoan.setValue('')
      this.RefundDet.controls.ach.setValue(false)
      this.RefundDet.controls.bankName.setValue('')
      this.RefundDet.controls.routing.setValue('')
      this.RefundDet.controls.acct.setValue('')
      this.RefundDet.controls.reqExpedited.setValue(false)
      this.RefundDet.controls.approveExpedited.setValue(false)
      this.CollectInfo = 'N'
    }

  }
  dealercancel(){
    this.RefundDet.controls.contractOwner.setValue('');
    this.RefundDet.controls.address.setValue('');
    this.RefundDet.controls.city.setValue('')
    this.RefundDet.controls.state.setValue('');
    this.RefundDet.controls.zip.setValue('');
    this.RefundDet.controls.outstandingLoan.setValue('')
    this.RefundDet.controls.finame.setValue('');
    this.RefundDet.controls.acnumber.setValue('');
    this.selectedstatename = 'SELECT'
    // this.RefundDet = this.fB.group({
    //   contractOwner: [''],
    //   address: [''],
    //   city: [''],
    //   state: [''],
    //   zip: [''],
    //   ach: [''],
    //   loanleasedet:[''],
    //   bankName: [''],
    //   routing: [''],
    //   acct: [''],
    //   outstandingLoan: [''],
    //   finame:[''],
    //   acnumber:[''],
    //   reqExpedited: [''],
    //   approveExpedited: [''],
    //   agreeCancellationTerms: [''],
    //   customerSignchk: [''],
    //   customersign: [''],
    //    acknowledge: [''],
    // });
  }
  getStates() {
    const obj = {}
    this.api.postmethod('CancellationForm/GetStates', obj).subscribe(res => {
      console.log('store', res.response.recordset)
      this.states = res.response.recordset
    })

  }
  getstores() {
    const obj = {
      as_id: ''
    }
    this.api.postmethod('CancellationForm/GetStores', obj).subscribe(res => {
      console.log('store', res.response.recordset)
      this.stores = res.response.recordset
    })
  }

  // getstoreswithemails(){
  //   const obj = {}
  //   this.api.postmethod('CancellationForm/GetCFGroupMails', obj).subscribe(res => {
  //     console.log('storewithemail', res.response.recordset)
  //     this.stores = res.response.recordset
  //   })
  // }
  getyear() {
    const obj = {
      y_id: ''
    }
    this.api.postmethod('CancellationForm/GetYears', obj).subscribe(res => {
      console.log('year', res)
      this.vehicleyear = res.response.recordset
      console.log('year', this.vehicleyear)

    })

  }
  getmake() {
    if (this.VehicleDet.value.year > 0) {
      const obj = {
        d_year: this.VehicleDet.value.year
      }
      this.api.postmethod('CancellationForm/GetMake', obj).subscribe(res => {
        console.log('make', res)
        this.vehiclemake = res.response.recordset
      })
    }
  }

  getmodel() {
    console.log(this.VehicleDet.value.year.length, this.VehicleDet.value.make.length);
    if (this.VehicleDet.value.year > 0 && this.VehicleDet.value.make > 0) {
      console.log("if block");
      const obj = {
        division_id: this.VehicleDet.value.make,
        year: this.VehicleDet.value.year
      }
      this.api.postmethod('CancellationForm/GetModel', obj).subscribe(res => {
        console.log('model', res)
        this.vehiclemodel = res.response.recordset
      })
    }

  }
 
  notify(e) {
    // console.log(e.target.checked)
    if (e.target.checked == true) {
      this.checkStatus = true;
      this.statusalertmsg = false;
    }
    else {
      this.checkStatus = false;
      this.statusalertmsg = true;
    }
  }
  OpenStatus() {
    this.status = true;
    this.statusform = true;
    this.statusresult = false;
    this.Requeststatus = ''
this.refid=''
this.vinlastname=''
  }
  closestatus(val) {
    this.cancellationData = [];
    if (val == 'SR') {
      console.log(this.checkStatus)

      if (this.vinlastname != '' && this.refid != '') {
        this.statusalertmsg = false
        var regex = /\d+/g;
        var matches = this.vinlastname.match(regex); 
        if(matches && this.vinlastname.length==17){
          const obj = {
            "REFERENCEID":this.refid,
            "VIN":this.vinlastname,
            "LASTNAME":""
          }
        this.api.postmethod('CancellationForm/GetServiceCancellations', obj).subscribe(res => {
          console.log(res);
          this.cancellationData=res.response.recordset
          if (this.cancellationData.length > 0) {
            this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE
console.log('this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE',this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE)

            if (this.cancellationData[0].CF_ACTIVE == 'SP') {
              this.Requeststatus = 'Sent For Processing'
            }
            if (this.cancellationData[0].CF_ACTIVE == 'PP') {
              this.Requeststatus = 'Payment Processed '
            }
            if (this.cancellationData[0].CF_ACTIVE == 'Open') {
              this.Requeststatus = 'Open'
            }
            this.status = true;
            this.checkStatus = false;
            this.statusalertmsg = false;
            this.statusresult = true;
            this.statusform = false;
            this.warningMessage = ''

          }
          else {
            this.closeBtn.nativeElement.click();
            document.getElementById("warningbtn").click();

            this.status = false;
            this.statusform = false;
            this.statusresult = false;
            this.checkStatus = false;
            this.statusalertmsg = false;
            this.warningMessage = ''
            this.refid = ''
            this.vinlastname = ''
            this.message = true
            this.responceContent = 'Invalid Details'
          }
        })
        }
        else{
          const obj = {
            "REFERENCEID":this.refid,
            "VIN":"",
            "LASTNAME":this.vinlastname
          }
          this.api.postmethod('CancellationForm/GetServiceCancellations', obj).subscribe(res => {
            console.log(res)
            this.cancellationData=res.response.recordset
            if (this.cancellationData.length > 0) {
              this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE
console.log('this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE',this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE)
              if (this.cancellationData[0].CF_ACTIVE == 'SP') {
                this.Requeststatus = 'Sent For Processing'
              }
              if (this.cancellationData[0].CF_ACTIVE == 'PP') {
                this.Requeststatus = 'Payment Processed '
              }
              if (this.cancellationData[0].CF_ACTIVE == 'Open') {
                this.Requeststatus = 'Open'
              }
              this.status = true;
              this.checkStatus = false;
              this.statusalertmsg = false;
              this.statusresult = true;
              this.statusform = false;
              this.warningMessage = ''

            }
            else {
              this.closeBtn.nativeElement.click();
              document.getElementById("warningbtn").click();

              this.status = false;
              this.statusform = false;
              this.statusresult = false;
              this.checkStatus = false;
              this.statusalertmsg = false;
              this.warningMessage = ''
              this.refid = ''
              this.vinlastname = ''
              this.message = true
              this.responceContent = 'Invalid Details'
            }
          })
        }
        const obj = {
      }
        // this.cancellationData = [];
//         this.api.postmethod('CancellationForm/GetServiceCancellations', obj).subscribe(res => {
      
//           this.cancellationData = res.response.recordset.filter(item => item.CF_REFERENCEID == this.refid && item.CUST_VIN == this.vinlastname.toUpperCase());
       
//           if (this.cancellationData.length == 0) {
//             this.cancellationData = res.response.recordset.filter(item => item.CF_REFERENCEID == this.refid && item.CF_CUST_LASTNAME == this.vinlastname.toUpperCase());
//             console.log(this.cancellationData)

//             if (this.cancellationData.length > 0) {
//               this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE
// console.log('this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE',this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE)

//               if (this.cancellationData[0].CF_ACTIVE == 'SP') {
//                 this.Requeststatus = 'Sent For Processing'
//               }
//               if (this.cancellationData[0].CF_ACTIVE == 'PP') {
//                 this.Requeststatus = 'Payment Processed '
//               }
//               if (this.cancellationData[0].CF_ACTIVE == 'Open') {
//                 this.Requeststatus = 'Open'
//               }
//               this.status = true;
//               this.checkStatus = false;
//               this.statusalertmsg = false;
//               this.statusresult = true;
//               this.statusform = false;
//               this.warningMessage = ''

//             }
//             else {
//               this.closeBtn.nativeElement.click();
//               document.getElementById("warningbtn").click();

//               this.status = false;
//               this.statusform = false;
//               this.statusresult = false;
//               this.checkStatus = false;
//               this.statusalertmsg = false;
//               this.warningMessage = ''
//               this.refid = ''
//               this.vinlastname = ''
//               this.message = true
//               this.responceContent = 'Invalid Details'
//             }
//           }
//           else {
//             this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE
// console.log('this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE',this.cancellationData[0].CF_PAYMENT_UPLOAD_CHEQUE)
//             if (this.cancellationData[0].CF_ACTIVE == 'SP') {
//               this.Requeststatus = 'Sent For Processing'
//             }
//             if (this.cancellationData[0].CF_ACTIVE == 'PP') {
//               this.Requeststatus = 'Payment Processed '
//             }
//             if (this.cancellationData[0].CF_ACTIVE == 'Open') {
//               this.Requeststatus = 'Open'
//             }
//             this.status == true;

//             this.statusresult = true;
//             this.statusform = false;
//             this.checkStatus = false;
//             this.statusalertmsg = false;
//             this.warningMessage = ''

//           }
//         })
      }
      // else if (this.checkStatus == false) {
      //   this.statusalertmsg = true
      // }
      else if (this.vinlastname == '' && this.refid == '') {
        this.warningMessage = 'Please Provide Ref # and VIN/LastName'
      }
      else if (this.refid == '') {
        this.warningMessage = 'Please Provide Ref #'
      }
      else if (this.vinlastname == '') {
        this.warningMessage = 'Please Provide VIN/LastName'
      }

    }
    if (val == 'OC') {
      this.status = false;
      this.statusform = false;
      this.statusresult = false;
      this.refid = ''
      this.vinlastname = '';
      this.checkStatus = false;
      this.statusalertmsg = false;
      this.warningMessage = ''
    }




  }
  Loanorlease(e) {
    this.Loan = e.target.value
    if (this.Loan == 'Y') {
      this.RefundDet.controls.ach.setValue(false);
      this.RefundDet.controls.bankName.setValue('');
      this.RefundDet.controls.routing.setValue('');
      this.RefundDet.controls.acct.setValue('');
      this.RefundDet.controls.loanleasedet.setValue('')
      this.RefundDet.controls.finame.setValue('');
      this.RefundDet.controls.acnumber.setValue('');
      // finame,acnumber
      this.expedited = false
      this.CollectInfo = 'N'
      this.RefundDet.controls.ach.setValue(false);
    }
    if (this.Loan == 'N') {
      this.expedited = true
      this.RefundDet.controls.reqExpedited.setValue(false);
      this.RefundDet.controls.approveExpedited.setValue(false)
      this.RefundDet.controls.bankName.setValue('');
      this.RefundDet.controls.routing.setValue('');
      this.RefundDet.controls.acct.setValue('');
      this.RefundDet.controls.loanleasedet.setValue('')
      this.RefundDet.controls.finame.setValue('');
      this.RefundDet.controls.acnumber.setValue('');
      // this.appfee=false;
    }
    // if(this.Loan!='Y' || this.pwcvalue!='PWC'){
    //   this.RefundDet.controls.ach.setValue(false);
    //   // console.log(this.RefundDet.value)
    //   this.expedited=true
    // }
    // if(this.Loan=='Y'){
    //   this.CollectInfo = 'N'
    //   // this.RefundDet.value.ach=false;
    //   this.RefundDet.controls.ach.setValue(false);
    //   // console.log(this.RefundDet.value)

    // }
    // if(this.Loan=='N'){
    //   this.expedited=true
    // }
  }
  //   pwc(e){
  // this.pwcvalue=e.target.value
  // if(this.Loan=='Y' && this.pwcvalue=='PWC'){
  //   this.RefundDet.controls.ach.setValue(false);
  //   console.log(this.RefundDet.value)
  //   this.expedited=false
  // }
  // if(this.Loan!='Y' || this.pwcvalue!='PWC'){
  //   this.RefundDet.controls.ach.setValue(false);
  //   console.log(this.RefundDet.value)
  //   this.expedited=true
  // }

  //   }
  PreviousUrl() {
    this.location.back();
  }

  CollectDetails(event) {
    let target = event.target;
    if (target.checked)
      this.CollectInfo = 'Y'
    else
      this.CollectInfo = 'N';
  }
  Others(event) {
    console.log(event.target)
    let target = event.target;
    if (target.checked) {
      this.otherText = 'Y';
    }
    else {
      this.ReasonsForCancel.controls.otheretext.setValue(' ')
      this.otherText = 'N';
    }

  }
  Ancillary(event) {
    let target = event.target;
    if (target.checked) {
      this.ancillary = 'Y';
    }
    else {
      this.ContractType.controls.ancillaryType.setValue(' ')
      this.ancillary = 'N';
    }
  }
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  uploadFile(e) {
    console.log(e.target.files)
    this.uploadcontract = e.target.value.substring(12)
    this.DocumentfileName = e.target.files[0];
    console.log(this.DocumentfileName)
    var extension = this.uploadcontract.substring(this.uploadcontract.lastIndexOf('.'));
    //  '.jpg', '.png', '.jpeg', '.doc', '.docx', '.xls', '.xlsx', '.PDF',
    //  '.JPG', '.PNG', '.gif', '.GIF', '.pdf', '.DOC', '.rtf', '.RTF'
if ((extension != ".txt") && (extension != ".jpg") && (extension != ".png") && (extension != ".jpeg") &&
(extension != ".doc") && (extension != ".docx") && (extension != ".xls") && (extension != ".xlsx") &&
(extension != ".PDF") && (extension != ".JPG") && (extension != ".PNG") && (extension != ".gif") &&
(extension != ".GIF") && (extension != ".pdf") && (extension != ".pdf") && (extension != ".DOC") &&
(extension != ".rtf") && (extension != ".RTF"))
{
  if(extension != ''){
  this.uploadcontract=''
  this.DocumentfileName = '';
  document.getElementById("warningbtn").click();
        this.responceContent =' File extension " ' + extension+' "  is not Supported to Upload'
        this.ReasonsForCancel.controls.upload.setValue('')
  }
}
    // var reader = new FileReader();
    // reader.readAsDataURL(e.target.files[0]);
    // reader.onload = (event) => {
    //   this.UploadedFile = reader.result;
    // };
    // console.log(this.UploadedFile)
  }
  uploadContract(e) {
    console.log(e.target.value.substring(12))
    this.ContractName = e.target.value.substring(12)
    console.log(this.DocumentfileName)
    console.log(this.ContractName)

    this.ContractFileName = e.target.files[0];
    console.log(this.ContractFileName)
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (event) => {
      this.UploadedFile = reader.result;
    };
    // console.log(this.UploadedFile)
    var extension = this.ContractName.substring(this.ContractName.lastIndexOf('.'));
    //  '.jpg', '.png', '.jpeg', '.doc', '.docx', '.xls', '.xlsx', '.PDF',
    //  '.JPG', '.PNG', '.gif', '.GIF', '.pdf', '.DOC', '.rtf', '.RTF'
if ((extension != ".txt") && (extension != ".jpg") && (extension != ".png") && (extension != ".jpeg") &&
(extension != ".doc") && (extension != ".docx") && (extension != ".xls") && (extension != ".xlsx") &&
(extension != ".PDF") && (extension != ".JPG") && (extension != ".PNG") && (extension != ".gif") &&
(extension != ".GIF") && (extension != ".pdf") && (extension != ".pdf") && (extension != ".DOC") &&
(extension != ".rtf") && (extension != ".RTF") )
{
  if(extension != ''){
  this.ContractName=''
  this.ContractFileName = '';
  document.getElementById("warningbtn").click();
  this.responceContent =' File extension " ' + extension+' "  is not Supported to Upload'

        this.ContractType.controls.uploadContract.setValue('')
}
}
  }
 
  selecteddropdownvalues(type, id, name, email?) {
    if (type == 'Store') {
      this.selectedstorename = name
      // this.selectedstoreid=id
      this.storeemail=email
      this.VehicleDet.controls.sellingDealership.setValue(id);
      console.log(this.VehicleDet.value)
    }
    if (type == 'Year') {
      this.selectedyearname = name;
      // this.selectedyearid=id;
      this.VehicleDet.controls.year.setValue(id);
      console.log(this.VehicleDet.value)
      this.getmake()
    }
    if (type == 'Make') {
      this.selectedmakename = name;
      // this.selectedyearid=id;
      this.VehicleDet.controls.make.setValue(id);
      console.log(this.VehicleDet.value)
      this.getmodel()
    }
    if (type == 'Model') {
      this.selectedmodelname = name;
      // this.selectedyearid=id;
      this.VehicleDet.controls.model.setValue(id);
      console.log(this.VehicleDet.value)
    }
    if (type == 'ContractType') {
      this.selectcontractname = name;
      // this.selectedyearid=id;
      this.ContractType.controls.type.setValue(id);
      console.log(this.ContractType.value)
    }
    if (type == 'State') {
      this.selectedstatename = name;
      // this.selectedyearid=id;
      this.RefundDet.controls.state.setValue(id);
      console.log(this.RefundDet.value)
    }

  }
  reqProcessing(e) {
    if (e.target.checked == true) {

      this.RefundDet.controls.approveExpedited.setValue(true)
    }
    else {

      this.RefundDet.controls.approveExpedited.setValue(false)
    }
  }
  appProcessing(e) {
    if (e.target.checked == true) {

      this.RefundDet.controls.reqExpedited.setValue(true)
    }
    else {

      this.RefundDet.controls.reqExpedited.setValue(false)
    }
  }
  save() {
    console.log(this.ContractFileName)
    console.log(this.DocumentfileName)
  
    if(this.VehicleDet.value.firstName=='' ||    this.VehicleDet.value.lastName=='' ||     this.VehicleDet.value.phone=='' || 
   this.VehicleDet.value.emailid=='' ||    this.VehicleDet.value.sellingDealership==0 ||    this.VehicleDet.value.vin=='' || 
   this.uploadcontract=='' || (this.RefundDet.value.outstandingLoan=='Y' && this.RefundDet.value.finame=='') || (this.RefundDet.value.outstandingLoan=='Y' && this.RefundDet.value.acnumber=='') 
 
   ){
    this.submitted = true;

    document.getElementById("validation").click();
   }
    if (this.VehicleDet.invalid || this.uploadcontract=='' || (this.RefundDet.value.outstandingLoan=='Y' && this.RefundDet.value.finame=='') || (this.RefundDet.value.outstandingLoan=='Y' && this.RefundDet.value.acnumber=='') ) {
      // this.submitted = true;

      // document.getElementById("validation").click();

    }

    else {
      if (this.RefundDet.value.bankName == '' && this.RefundDet.value.ach == true) {
        this.submitted = true
        document.getElementById("achvalidation").click();
      }
      else if (this.RefundDet.value.acct == '' && this.RefundDet.value.ach == true) {
        this.submitted = true
        document.getElementById("achvalidation").click();
      }
// else if(this.RefundDet.value.outstandingLoan=='Y' && this.RefundDet.value.loanleasedet == ''){
//   this.submitted = true
//   document.getElementById("achvalidation").click();
// }
else if (this.ReasonsForCancel.value.customerRequest==''  && this.ReasonsForCancel.value.SalesDeal==''  && this.ReasonsForCancel.value.vehicleSold=='' && 
this.ReasonsForCancel.value.repossession=='' && this.ReasonsForCancel.value.satisfiedLien=='' &&
 this.ReasonsForCancel.value.totalLossofVehicle=='' && this.ReasonsForCancel.value.other=='' && 
 this.ReasonsForCancel.value.dealercancellation==''){
  this.message = true;
  this.submitted = false;
  document.getElementById("warningbtn").click();
  this.responceContent = 'Please check atleast one Reason for Cancellation'
 }
      else if (this.RefundDet.value.customerSignchk == false) {
        this.message = true;
        this.submitted = false;
        document.getElementById("warningbtn").click();

        this.responceContent = 'Please check the ' + '"Signature"' + ' box to submit this form.'
      }
      else if (this.RefundDet.value.acknowledge == false) {

        this.message = true;
        this.submitted = false;
        document.getElementById("warningbtn").click();

        this.responceContent = 'Please check the ' + '"Acknowledge"' + ' box to submit this form.'
      }
      else if (this.RefundDet.value.agreeCancellationTerms == false) {

        this.message = true;
        this.submitted = false;
        document.getElementById("warningbtn").click();

        this.responceContent = 'Please check the ' + '"Terms of Cancellation"' + ' box to submit this form.'
      }
      else if (this.confirmation == false) {
        this.confirmationPopup = true;
        this.submitted = false;
        document.getElementById("confirm").click();

        // this.responceContent = '	Note: Any refund amount will be paid to the lienholder (if applicable) and applied by the lienholder in accordance with the terms and conditions of any financial arrangement you have with the lienholder. If applicable, canceling service products will not lower your payment.'
      }





    }
  }
  closeConfirm(val) {
    if (val == 'Y') {
      this.confirmationPopup = false;
      this.confirmation = true
      this.submitted = false;
      console.log(this.datepipe.transform(this.VehicleDet.value.dateOfContract, 'MM-dd-yyyy'))
      if (this.datepipe.transform(this.VehicleDet.value.dateOfContract, 'MM-dd-yyyy') == null) {
        this.contract = ''
      }
      else {
        this.contract = this.datepipe.transform(this.VehicleDet.value.dateOfContract, 'MM-dd-yyyy')
      }
      if (this.datepipe.transform(this.VehicleDet.value.dateOfCancellation, 'MM-dd-yyyy') == null) {
        this.cancel = ''
      }
      else {
        this.cancel = this.datepipe.transform(this.VehicleDet.value.dateOfCancellation, 'MM-dd-yyyy')
      }
      if (this.RefundDet.value.outstandingLoan != 'Y' && this.RefundDet.value.outstandingLoan != 'N') {
        this.RefundDet.value.outstandingLoan = ''
        console.log(this.RefundDet.value.outstandingLoan)
      }
      // const obj = {
      //   "ACTION": "A",
      //   "CF_ID": "",
      //   "CF_CUSTFIRSTNAME": this.VehicleDet.value.firstName,
      //   "CF_CUSTLASTNAME": this.VehicleDet.value.lastName,
      //   "CF_CUST_PHONE": this.VehicleDet.value.phone,
      //   "CF_CUST_EMAILID": this.VehicleDet.value.emailid,
      //   "CF_AS_ID": this.VehicleDet.value.sellingDealership,
      //   "CF_CONTRACTNUM": this.VehicleDet.value.contract,
      //   "CF_VIN": this.VehicleDet.value.vin,
      //   "CF_YEAR": this.VehicleDet.value.year,
      //   "CF_MAKE": this.VehicleDet.value.make,
      //   "CF_MODEL": this.VehicleDet.value.model,
      //   "CF_CONTRACTDATE": this.datepipe.transform(this.VehicleDet.value.dateOfContract,'MM-dd-yyyy'),
      //   "CF_CANCELLATIONDATE": this.datepipe.transform(this.VehicleDet.value.dateOfCancellation,'MM-dd-yyyy'),
      //   "CF_MILEAGEATCANCELLATION": this.VehicleDet.value.mileage,

      //   "CF_REASON_CUSTOMER": this.ReasonsForCancel.value.customerRequest?'Y':'N',
      //   "CF_REASON_VEHICLESOLD": this.ReasonsForCancel.value.vehicleSold?'Y':'N',
      //   "CF_REASON_REPOSSESSION": this.ReasonsForCancel.value.repossession?'Y':'N',
      //   "CF_REASON_SATISFIEDLIEN": this.ReasonsForCancel.value.satisfiedLien?'Y':'N',
      //   "CF_REASON_TOTALLOSS": this.ReasonsForCancel.value.totalLossofVehicle?'Y':'N',
      //   "CF_REASON_OTHER": this.ReasonsForCancel.value.other?'Y':'N',
      //   "CF_REASON_OTHERTEXT": this.ReasonsForCancel.value.otheretext,
      //   // "CF_REASON_UPLOADFILE": this.DocumentfileName,
      //   "CF_REASON_UPLOADFILE": this.uploadcontract,

      //   "CF_CONTRACTTYPE": this.ContractType.value.type,
      //   "CF_CONTRACTTYPE_VSC": this.ContractType.value.vehicleServiceContract?'Y':'N',
      //   "CF_CONTRACTTYPE_GAP": this.ContractType.value.gap?'Y':'N',
      //   "CF_CONTRACTTYPE_ANCILLARY": this.ContractType.value.ancillary?'Y':'N',
      //   "CF_CONTRACTTYPE_ANCILLARYTEXT": this.ContractType.value.ancillaryType,
      //   // "CF_CONTRACTTYPE_UPLOADFILE": this.ContractFileName,
      //   "CF_CONTRACTTYPE_UPLOADFILE": this.ContractName,

      //   "CF_CONTRACTOWNER": this.RefundDet.value.contractOwner,
      //   "CF_ADDRESS": this.RefundDet.value.address,
      //   "CF_CITY": this.RefundDet.value.city,
      //   "CF_STATE": this.RefundDet.value.state,
      //   "CF_ZIP": this.RefundDet.value.zip,
      //   "CF_REFUND_ACH": this.RefundDet.value.ach?'Y':'N',
      //   "CF_REFUND_ACH_BANKNAME": this.RefundDet.value.bankName,
      //   "CF_REFUND_ACH_ROUTINGNUM": this.RefundDet.value.routing,
      //   "CF_REFUND_ACH_ACCOUNTNUM": this.RefundDet.value.acct,
      //   //  doubt
      //   "CF_REFUND_PROCESSINGFEE": this.RefundDet.value.reqExpedited?'Y':'N',

      //   "CF_REFUND_PROCESSINGFEE_APPROVE": this.RefundDet.value.approveExpedited?'Y':'N',
      //   "CF_REFUND_TERMSAGGREEMENT": this.RefundDet.value.agreeCancellationTerms?'Y':'N',
      //   "CF_REFUND_IS_DIGITALCUSTOMERSIGN": this.RefundDet.value.customerSignchk?'Y':'N',
      //   "CF_REFUND_DIGITALCUSTOMERSIGN": this.RefundDet.value.customersign,
      //   "CF_IS_ACKNOWLEDGEMENT": this.RefundDet.value.acknowledge?'Y':'N',
      //   // doubt
      //   "CF_CREATEDBY": '1',
      //   "CF_ACTIVE": 'Y',
      // }
      const fd: any = new FormData();
      fd.append('ACTION', 'A');
      fd.append('CF_ID', '');
      fd.append('CF_CUSTFIRSTNAME', this.VehicleDet.value.firstName);
      fd.append('CF_CUSTLASTNAME', this.VehicleDet.value.lastName);
      fd.append('CF_CUST_PHONE', this.VehicleDet.value.phone);
      fd.append('CF_CUST_EMAILID', this.VehicleDet.value.emailid);

      fd.append('CF_PREFERRED_METHODOF_CONTACT', this.VehicleDet.value.mtdofcontact)
      fd.append('CF_AS_ID', this.VehicleDet.value.sellingDealership);
      fd.append('CF_CONTRACTNUM', this.VehicleDet.value.contract);
      fd.append('CF_VIN', this.VehicleDet.value.vin);
      fd.append('CF_YEAR', this.VehicleDet.value.year);
      fd.append('CF_MAKE', this.VehicleDet.value.make);
      fd.append('CF_MODEL', this.VehicleDet.value.model);
      fd.append('CF_CONTRACTDATE', this.contract);
      fd.append('CF_CANCELLATIONDATE', this.cancel);
      fd.append('CF_MILEAGEATCANCELLATION', this.VehicleDet.value.mileage);


      fd.append('CF_REASON_CUSTOMER', this.ReasonsForCancel.value.customerRequest ? 'Y' : 'N');
      fd.append('CF_SALES_DEAL_VOIDED', this.ReasonsForCancel.value.SalesDeal ? 'Y' : 'N');      
      fd.append('CF_REASON_VEHICLESOLD', this.ReasonsForCancel.value.vehicleSold ? 'Y' : 'N');
      fd.append('CF_REASON_REPOSSESSION', this.ReasonsForCancel.value.repossession ? 'Y' : 'N');
      fd.append('CF_REASON_SATISFIEDLIEN', this.ReasonsForCancel.value.satisfiedLien ? 'Y' : 'N');
      fd.append('CF_REASON_TOTALLOSS', this.ReasonsForCancel.value.totalLossofVehicle ? 'Y' : 'N');
      fd.append('CF_REASON_OTHER', this.ReasonsForCancel.value.other ? 'Y' : 'N');
      fd.append('CF_REASON_OTHERTEXT', this.ReasonsForCancel.value.otheretext);
      fd.append('CF_REASON_IS_DEALER_CANCELLATION', this.ReasonsForCancel.value.dealercancellation ? 'Y' : 'N');

      

      fd.append('CF_CONTRACTTYPE', this.ContractType.value.type);
      fd.append('CF_CONTRACTTYPE_VSC', this.ContractType.value.vehicleServiceContract ? 'Y' : 'N');
      fd.append('CF_CONTRACTTYPE_GAP', this.ContractType.value.gap ? 'Y' : 'N');
      fd.append('CF_CONTRACTTYPE_ANCILLARY', this.ContractType.value.ancillary ? 'Y' : 'N');
      fd.append('CF_CONTRACTTYPE_ANCILLARYTEXT', this.ContractType.value.ancillaryType);

      fd.append('CF_CONTRACTOWNER', this.RefundDet.value.contractOwner);
      fd.append('CF_ADDRESS', this.RefundDet.value.address);
      fd.append('CF_CITY', this.RefundDet.value.city);
      fd.append('CF_STATE', this.RefundDet.value.state);
      fd.append('CF_ZIP', this.RefundDet.value.zip);
      fd.append('CF_REFUND_ACH', this.RefundDet.value.ach ? 'Y' : 'N');
      fd.append('CF_REFUND_ACH_BANKNAME', this.RefundDet.value.bankName);
      fd.append('CF_REFUND_ACH_ROUTINGNUM', this.RefundDet.value.routing);
      fd.append('CF_REFUND_ACH_ACCOUNTNUM', this.RefundDet.value.acct);
      fd.append('CF_REFUND_ISEXISTSOUTSTANDINGLOAN', this.RefundDet.value.outstandingLoan);
      fd.append('CF_REFUND_IFOUTSTANDINGLOAN_IS_FIN_ACCTNO', this.RefundDet.value.loanleasedet);
      fd.append('CF_REFUND_FIN_INSTITUTE', this.RefundDet.value.finame);

      fd.append('CF_REFUND_FIN_ACCTNUM', this.RefundDet.value.acnumber);

      
      
      fd.append('CF_REFUND_PROCESSINGFEE', this.RefundDet.value.reqExpedited ? 'Y' : 'N');
      fd.append('CF_REFUND_PROCESSINGFEE_APPROVE', this.RefundDet.value.approveExpedited ? 'Y' : 'N');
      fd.append('CF_REFUND_TERMSAGGREEMENT', this.RefundDet.value.agreeCancellationTerms ? 'Y' : 'N');
      fd.append('CF_REFUND_IS_DIGITALCUSTOMERSIGN', this.RefundDet.value.customerSignchk ? 'Y' : 'N');
      fd.append('CF_IS_ACKNOWLEDGEMENT', this.RefundDet.value.acknowledge ? 'Y' : 'N');
      fd.append('CF_CREATEDBY', '1');
      fd.append('CF_ACTIVE', 'Open');
      fd.append('CF_NOTES','')
      fd.append('CF_REASON_UPLOADFILE', this.DocumentfileName);
      fd.append('CF_CONTRACTTYPE_UPLOADFILE', this.ContractFileName);
      fd.append('CF_PAYMENT_UPLOAD_CHEQUE',  null);      
      fd.append('STOREMAIL',this.storeemail)
      // fd.append('IMAGELINK', '');
      // fd.append('IMAGEFILE', '');
      console.log(fd.getAll('CF_REASON_UPLOADFILE'));
      // console.log(obj)
      this.api.postmethod('CancellationForm/CancellationFormAction', fd).subscribe(res => {
        console.log(res)

        if (res.status == '200') {
          document.getElementById("warningbtn").click();

          this.responceContent = "Your Cancellation request submitted successfully. Please use Ref # " + res.response + " for future communications"
          this.message = true
          this.uploadcontract = ''
          this.ContractName = ''
          this.ContractType.controls.gap.setValue(false);
          this.selectedstorename = 'SELECT'
          this.selectedyearname = 'SELECT'
          this.selectedmakename = 'SELECT'
          this.selectedmodelname = 'SELECT'
          this.selectcontractname = 'SELECT'
          this.selectedstatename = 'SELECT'

          // this.VehicleDet.controls.sellingDealership.setValue('');
          this.VehicleDet = this.fB.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            emailid: ['', [Validators.required]],
            mtdofcontact: [''],
            sellingDealership: ['', [Validators.required]],
            contract: [''],
            vin: ['', [Validators.required, Validators.maxLength(50)]],
            year: [''],
            make: [''],
            model: [''],
            dateOfContract: [''],
            dateOfCancellation: [''],
            mileage: [''],

          });
          this.ReasonsForCancel = this.fB.group({
            customerRequest: [''],
            SalesDeal: [''],
            vehicleSold: [''],
            repossession: [''],
            satisfiedLien: [''],
            totalLossofVehicle: [''],
            other: [''],
            otheretext: [''],
            upload: [''],
            dealercancellation:['']

          });
          this.ContractType = this.fB.group({
            type: [''],
            vehicleServiceContract: [''],
            gap: [''],
            ancillary: [''],
            ancillaryType: [''],
            uploadContract: [''],

          });
          this.RefundDet = this.fB.group({
            contractOwner: [''],
            address: [''],
            city: [''],
            state: [''],
            zip: [''],
            ach: [''],
            loanleasedet:[''],
            bankName: [''],
            routing: [''],
            acct: [''],
            outstandingLoan: [''],
            finame:[''],
            acnumber:[''],
            reqExpedited: [''],
            approveExpedited: [''],
            agreeCancellationTerms: [''],
            customerSignchk: [''],
            customersign: [''],
            acknowledge: [''],
          });
          this.CollectInfo = 'N'
          this.confirmation = false;
        }
        else {
          this.message = true
          this.responceContent = res.message
          document.getElementById("warningbtn").click();
          this.confirmationPopup = false;
          this.confirmation = false;
        }

      },
        (error) => {                              //Error callback
          console.error('error caught in component')
          document.getElementById("warningbtn").click();

          this.message = true;
          this.responceContent = "We ran into some issue please try again!!";
          this.confirmation = false;
          //throw error;   //You can also throw the error to a global error handler
        });



    }
    else {
      this.confirmationPopup = false;
      this.confirmation = false;
    }
  }
  ok() {
    this.submitted = false
    // this.router.navigate(['cancellationsubmission'])

  }
  closemessage() {
    this.message = false;
  }
  openform(refid) {
    let ref = refid.substring(1)
    var data;
    const obj = {

      "REFERENCEID": ref,
      "VIN": "",
      "LASTNAME": ""

    };


    this.api.postmethod('CancellationForm/GetServiceCancellations', obj).subscribe(res => {
      console.log(res)
      data = res.response.recordset[0]
      this.cancellationstatus = data.CF_ACTIVE
      // this.dtofcnclton = this.datepipe.transform(data.CANCELLATION_DATE, 'yyyy-MM-dd')
      // this.dtofcntrct = this.datepipe.transform(data.CONTRACT_DATE, 'yyyy-MM-dd')

      // var datearray1 = this.dtofcnclton.split("-");
      // this.dtofcnclton = datearray1[1] + '/' + datearray1[2] + '/' + datearray1[0];
      // var datearray2 = this.dtofcntrct.split("-");
      // this.dtofcntrct = datearray2[1] + '/' + datearray2[2] + '/' + datearray2[0];
      this.dtofcnclton=data.CANCELLATION_DATE
      this.dtofcntrct=data.CONTRACT_DATE
      this.ContractFile = data.CF_CONTRACTTYPE_UPLOADFILE
      this.ReasonFile = data.CF_REASON_UPLOADFILE
      if (data.CF_REFUND_ISEXISTSOUTSTANDINGLOAN != null) {
        if (data.CF_REFUND_ISEXISTSOUTSTANDINGLOAN == 'Y') {
          this.outstandingLoan = 'Y'
        }
        else {
          this.outstandingLoan = 'N'
        }
      }
      else {
        this.outstandingLoan = ''
      }
      if (data.CF_REFUND_ACH == 'Y') {
        this.CollectInfo = 'Y'
      }
      else {
        this.CollectInfo = 'N'
      }


      this.VehicleDet = this.fB.group({
        firstName: [data.CF_CUST_FIRSTNAME],
        lastName: [data.CF_CUST_LASTNAME],
        phone: [data.CUST_PHONE],
        emailid: [data.CUST_EMAILID],
        mtdofcontact: [data.CF_PREFERRED_METHODOF_CONTACT],
        sellingDealership: [data.DEALER_NAME],
        contract: [data.CONTRACT_NUM],
        vin: [data.CUST_VIN],
        year: [data.CF_YEAR],
        make: [data.Make_NAME],
        model: [data.Model_NAME],
        dateOfContract: [this.dtofcntrct],
        dateOfCancellation: [this.dtofcnclton],
        mileage: [data.CF_MILEAGEATCANCELLATION],
      });
      this.ReasonsForCancel = this.fB.group({
        customerRequest: [data.CF_REASON_CUSTOMER == 'Y' ? true : false],
        SalesDeal: [data.CF_SALES_DEAL_VOIDED == 'Y' ? true : false],
        vehicleSold: [data.CF_REASON_VEHICLESOLD == 'Y' ? true : false],
        repossession: [data.CF_REASON_REPOSSESSION == 'Y' ? true : false],
        satisfiedLien: [data.CF_REASON_SATISFIEDLIEN == 'Y' ? true : false],
        totalLossofVehicle: [data.CF_REASON_TOTALLOSS == 'Y' ? true : false],
        other: [data.CF_REASON_OTHER == 'Y' ? true : false],
        otheretext: [data.CF_REASON_OTHERTEXT],
        dealercancellation:[data.CF_REASON_IS_DEALER_CANCELLATION =='Y'? true :false]
        // upload: [''],

      });
      this.ContractType = this.fB.group({
        type: [data.CONTRACT_TYPE],
        vehicleServiceContract: [data.CF_CONTRACTTYPE_VSC == 'Y' ? true : false],
        gap: [data.CF_CONTRACTTYPE_GAP == 'Y' ? true : false],
        ancillary: [data.CF_CONTRACTTYPE_ANCILLARY == 'Y' ? true : false],
        ancillaryType: [data.CF_CONTRACTTYPE_ANCILLARYTEXT],
        uploadContract: [''],

      });
      this.RefundDet = this.fB.group({
        contractOwner: [data.CF_CONTRACTOWNER],
        address: [data.CF_ADDRESS],
        city: [data.CF_CITY],
        state: [data.State_Name],
        zip: [data.CF_ZIP],
        loanleasedet:[data.CF_REFUND_IFOUTSTANDINGLOAN_IS_FIN_ACCTNO],
        finame:[data.CF_REFUND_FIN_INSTITUTE],
        acnumber:[data.CF_REFUND_FIN_ACCTNUM],
        ach: [data.CF_REFUND_ACH == 'Y' ? true : false],
        bankName: [data.CF_REFUND_ACH_BANKNAME],
        routing: [data.CF_REFUND_ACH_ROUTING_NUM],
        acct: [data.CF_REFUND_ACH_ACCOUNT_NUM],
        outstandingLoan: [this.outstandingLoan],
        reqExpedited: [data.CF_REFUND_PROCESSINGFEE == 'Y' ? true : false],
        approveExpedited: [data.CF_REFUND_PROCESSINGFEE_APPROVE == 'Y' ? true : false],
        agreeCancellationTerms: [data.CF_REFUND_TERMSAGGREEMENT == 'Y' ? true : false],
        customerSignchk: [true],
        customersign: [''],
        acknowledge: [true],

      });

      if(data.CF_REASON_IS_DEALER_CANCELLATION=='Y'){
        this.RefundDet.controls.outstandingLoan.setValue('')
      }
    })
  }
}
