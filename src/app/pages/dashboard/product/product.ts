import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersServices } from '../../../core/services/dashboard/AllusersInfo/UsersServices';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.html',
  styleUrls: ['./product.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class Product implements OnInit {
  addProduct!: FormGroup;
  addTag!: FormGroup;
  updateTag!:FormGroup;
  isEdit = false;
  editProductId: number | null = null;

  allTags: any[] = [];
  allOffers: any[] = [];
  selectedImage: File | null = null;

  constructor(
    private toastr: ToastrService,
    private dashboardServices: UsersServices,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

   ngOnInit(): void {
    this.initForms();

    this.loadTags();
    this.loadOffers();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.editProductId = +id;
      this.loadProduct(this.editProductId);
    }
  }
  initForms() {
    this.addProduct = this.fb.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      brand: ['', Validators.required],
      tagType: ['', Validators.required],
      offer: [''],
      images: [null]
    });

    this.addTag = this.fb.group({
      tagType: ['', Validators.required]
    });

      this.updateTag = this.fb.group({
    tagType: ['', Validators.required]
  });
  }

originalTagType: string = '';

selectTagForUpdate(tag: any) {
  this.selectedTagId = tag.tagId;
  this.originalTagType = tag.tagType; 
  this.updateTag.patchValue({ tagType: tag.tagType });
}


onupdateTag() {
  if (!this.selectedTagId) {
    this.toastr.error("Please select a tag to update");
    return;
  }

  if (this.updateTag.invalid) {
    this.toastr.warning("Please enter a tag name");
    return;
  }

  const newTagType = this.updateTag.value.tagType.trim();

  if (newTagType === this.originalTagType) {
    return;
  }

  const tagData = { tagType: newTagType };

  this.dashboardServices.updateTag(tagData, this.selectedTagId).subscribe({
    next: () => {
      this.toastr.success("Tag updated successfully");
      this.loadTags();
      this.updateTag.reset();
      this.selectedTagId = null;
      this.originalTagType = '';
    },
    error: err => {
      console.error(err);
      this.toastr.error(err.error?.message || "Failed to update tag");
    }
  });
}



  loadProduct(id: number) {
    this.dashboardServices.GetAllProduct().subscribe((products: any[]) => {
      const product = products.find(p => p.id === id);
      if (product) {
        this.addProduct.patchValue({
          productName: product.productName,
          productDescription: product.productDescription,
          salary: product.salary,
          stock: product.stock,
          brand: product.brand,
          tagType: product.tagId,
          offer: product.offerId,
          images: product.images
        });
      }
    });
  }

  loadTags() {
    this.dashboardServices.getAllTags().subscribe((tags: any) => this.allTags = tags);
  }

  loadOffers() {
    this.dashboardServices.getAllOffers().subscribe((offers: any) => this.allOffers = offers);
  }


  onImageChange(event: any) {
    this.selectedImage = event.target.files[0];
  }
selectedTagId: number | null = null;



  onTag() {
    if (this.addTag.invalid) {
      this.toastr.warning("Please enter a tag name");
      return;
    }

    const tagData = { tagType: this.addTag.value.tagType };
    this.dashboardServices.CreateTag(tagData).subscribe({
      next: () => {
        this.toastr.success("Tag added successfully");
        this.addTag.reset();
        this.loadTags(); 
      },
      error: err => {
        console.error(err);
        this.toastr.error(err.error?.message || "Something went wrong");
      }
    });
  }
deleteTag(tagId: number) {
  if (!confirm("هل أنت متأكد من حذف هذا التاج؟")) {
    return;
  }

  this.dashboardServices.DeleteTag(tagId).subscribe({
    next: () => {
      this.toastr.success("Tag deleted successfully");
      this.loadTags(); 
      if (this.selectedTagId === tagId) {
        this.updateTag.reset();
        this.selectedTagId = null;
      }
    },
    error: err => {
      console.error(err);
      this.toastr.error(err.error?.message || "Something went wrong while deleting the tag");
    }
  });
}


onSubmit() {
  if (this.addProduct.invalid) {
    this.toastr.warning("Please fill all required fields");
    return;
  }

  const formValues = this.addProduct.value;

  const tagId = Number(formValues.tagType);
  if (isNaN(tagId) || tagId <= 0) {
    this.toastr.error('Please select a valid Tag');
    return;
  }

  const formData = new FormData();
  formData.append('productName', formValues.productName);
  formData.append('productDescription', formValues.productDescription);
  formData.append('salary', formValues.salary.toString());
  formData.append('stock', formValues.stock.toString());
  formData.append('brand', formValues.brand);
  formData.append('tagId', tagId.toString());

  if (formValues.offer) {
    formData.append('offerId', formValues.offer.toString());
  }

  if (this.selectedImage) {
    formData.append('Image', this.selectedImage);
  } else if (!this.isEdit) {
    this.toastr.error("Please select an image");
    return;
  }

  if (this.isEdit && this.editProductId) {
    this.dashboardServices.updateProduct(this.editProductId, formData).subscribe({
      next: () => {
        this.toastr.success("Product updated successfully");
      },
      error: err => {
        this.toastr.error(err.error?.message || "Something went wrong");
      }
    });
  } else {
    this.dashboardServices.CreateProduct(formData).subscribe({
      next: () => {
        this.toastr.success("Product added successfully");
      },
      error: err => {
        this.toastr.error(err.error?.message || "Something went wrong");
      }
    });
  }
}

}

