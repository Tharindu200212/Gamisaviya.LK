import React, { useState, useEffect } from 'react';
import { BackButton } from '../../components/common/BackButton';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Package, Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  nameSin?: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleMin: number;
  stock: number;
  unit: string;
  sellerId: string;
  sellerName: string;
  approved: boolean;
  featured: boolean;
  description?: string;
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameSin: '',
    category: '',
    retailPrice: '',
    wholesalePrice: '',
    wholesaleMin: '',
    stock: '',
    unit: 'kg',
    description: '',
  });

  const categories = [
    'Rice & Grains',
    'Fruits',
    'Vegetables',
    'Spices',
    'Coconut Products',
    'Traditional Foods',
    'Organic Products',
  ];

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const data = await import('../../utils/api').then(m => m.adminAPI.getAllProducts());
      if (data.success) {
        const mappedProducts = data.products.map((p: any) => ({
          id: p._id,
          name: p.name,
          nameSin: p.namesin,
          category: p.category,
          retailPrice: p.retailPrice,
          wholesalePrice: p.wholesalePrice,
          wholesaleMin: p.wholesaleThreshold,
          stock: p.stock,
          unit: 'units', // Backend doesn't seem to have unit field yet, default to units or derive
          sellerId: p.sellerId?._id || p.sellerId, // Handle populated or unpopulated
          sellerName: p.sellerId?.name || 'Unknown',
          approved: p.approved,
          featured: p.featured,
          description: p.description
        }));
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    if (statusFilter === 'approved') {
      filtered = filtered.filter((product) => product.approved);
    } else if (statusFilter === 'pending') {
      filtered = filtered.filter((product) => !product.approved);
    } else if (statusFilter === 'featured') {
      filtered = filtered.filter((product) => product.featured);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, statusFilter, products]);

  const handleEditProduct = () => {
    if (!selectedProduct || !formData.name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id
        ? {
          ...product,
          name: formData.name,
          nameSin: formData.nameSin,
          category: formData.category,
          retailPrice: parseFloat(formData.retailPrice),
          wholesalePrice: parseFloat(formData.wholesalePrice),
          wholesaleMin: parseInt(formData.wholesaleMin),
          stock: parseInt(formData.stock),
          unit: formData.unit,
          description: formData.description,
        }
        : product
    );

    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    toast.success('Product updated successfully');
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((product) => product.id !== productId));
      toast.success('Product deleted successfully');
    }
  };

  const handleToggleApproval = (productId: string) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, approved: !product.approved }
        : product
    );
    setProducts(updatedProducts);
    toast.success('Product approval status updated');
  };

  const handleToggleFeatured = (productId: string) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, featured: !product.featured }
        : product
    );
    setProducts(updatedProducts);
    toast.success('Product featured status updated');
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      nameSin: product.nameSin || '',
      category: product.category,
      retailPrice: product.retailPrice.toString(),
      wholesalePrice: product.wholesalePrice.toString(),
      wholesaleMin: product.wholesaleMin.toString(),
      stock: product.stock.toString(),
      unit: product.unit,
      description: product.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton to="/admin/dashboard" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-10 h-10 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          </div>
          <p className="text-gray-600">Manage all products across the platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Total Products</p>
            <p className="text-3xl font-bold text-blue-900">{products.length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-700 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-900">
              {products.filter((p) => p.approved).length}
            </p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <p className="text-sm text-yellow-700 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-900">
              {products.filter((p) => !p.approved).length}
            </p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <p className="text-sm text-purple-700 mb-1">Featured</p>
            <p className="text-3xl font-bold text-purple-900">
              {products.filter((p) => p.featured).length}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-52">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Retail Price</TableHead>
                  <TableHead>Wholesale</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{product.name}</p>
                          {product.nameSin && (
                            <p className="text-sm text-gray-500">{product.nameSin}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.sellerName}</TableCell>
                      <TableCell>LKR {product.retailPrice}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>LKR {product.wholesalePrice}</p>
                          <p className="text-gray-500">Min: {product.wholesaleMin}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            product.stock > 100
                              ? 'bg-green-100 text-green-700'
                              : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }
                        >
                          {product.stock} {product.unit}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant="outline"
                            className={
                              product.approved
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }
                          >
                            {product.approved ? 'Approved' : 'Pending'}
                          </Badge>
                          {product.featured && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-700">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => openViewDialog(product)}
                            variant="outline"
                            size="sm"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => openEditDialog(product)}
                            variant="outline"
                            size="sm"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleToggleApproval(product.id)}
                            variant="outline"
                            size="sm"
                            className={
                              product.approved
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-green-600 hover:bg-green-50'
                            }
                            title={product.approved ? 'Unapprove' : 'Approve'}
                          >
                            {product.approved ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* View Product Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Product Name</Label>
                    <p className="font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Name (Sinhala)</Label>
                    <p className="font-medium">{selectedProduct.nameSin || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Category</Label>
                    <p className="font-medium">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Seller</Label>
                    <p className="font-medium">{selectedProduct.sellerName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Retail Price</Label>
                    <p className="font-medium text-lg text-amber-600">
                      LKR {selectedProduct.retailPrice}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Wholesale Price</Label>
                    <p className="font-medium text-lg text-green-600">
                      LKR {selectedProduct.wholesalePrice}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Wholesale Minimum</Label>
                    <p className="font-medium">{selectedProduct.wholesaleMin} {selectedProduct.unit}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Stock Available</Label>
                    <p className="font-medium">{selectedProduct.stock} {selectedProduct.unit}</p>
                  </div>
                </div>
                {selectedProduct.description && (
                  <div>
                    <Label className="text-gray-600">Description</Label>
                    <p className="mt-1">{selectedProduct.description}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={
                      selectedProduct.approved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {selectedProduct.approved ? 'Approved' : 'Pending Approval'}
                  </Badge>
                  {selectedProduct.featured && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">
                      Featured Product
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Product Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-nameSin">Name (Sinhala)</Label>
                  <Input
                    id="edit-nameSin"
                    value={formData.nameSin}
                    onChange={(e) => setFormData({ ...formData, nameSin: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-retailPrice">Retail Price (LKR) *</Label>
                  <Input
                    id="edit-retailPrice"
                    type="number"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-wholesalePrice">Wholesale Price (LKR) *</Label>
                  <Input
                    id="edit-wholesalePrice"
                    type="number"
                    value={formData.wholesalePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, wholesalePrice: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-wholesaleMin">Wholesale Min *</Label>
                  <Input
                    id="edit-wholesaleMin"
                    type="number"
                    value={formData.wholesaleMin}
                    onChange={(e) =>
                      setFormData({ ...formData, wholesaleMin: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-unit">Unit *</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value: string) => setFormData({ ...formData, unit: value })}
                  >
                    <SelectTrigger id="edit-unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="g">Grams (g)</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditProduct} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
