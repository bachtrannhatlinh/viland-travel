import mongoose, { Document, Schema } from 'mongoose';

export interface ITour extends Document {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  duration: {
    days: number;
    nights: number;
  };
  destinations: string[];
  startLocation: {
    name: string;
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  endLocation: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
  price: {
    adult: number;
    child: number;
    infant: number;
    currency: string;
  };
  discountPrice?: {
    adult?: number;
    child?: number;
    infant?: number;
  };
  inclusions: string[];
  exclusions: string[];
  itinerary: [{
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }];
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  category: 'cultural' | 'adventure' | 'beach' | 'mountain' | 'city' | 'wildlife' | 'spiritual' | 'eco';
  tags: string[];
  maxGroupSize: number;
  minGroupSize: number;
  ageRestriction?: {
    minAge?: number;
    maxAge?: number;
  };
  languages: string[];
  tourGuide: {
    included: boolean;
    languages: string[];
  };
  transportation: {
    included: boolean;
    type: string[];
  };
  accommodation: {
    included: boolean;
    type: string;
    rating?: number;
  };
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  highlights: string[];
  requirements: string[];
  cancellationPolicy: {
    freeCancellation: {
      enabled: boolean;
      daysBeforeDeparture?: number;
    };
    cancellationFees: [{
      daysBeforeDeparture: number;
      feePercentage: number;
    }];
  };
  availability: [{
    startDate: Date;
    endDate: Date;
    availableSlots: number;
    price: {
      adult: number;
      child: number;
      infant: number;
    };
    isAvailable: boolean;
  }];
  reviews: [{
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }];
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  featured: boolean;
  promoted: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tourSchema = new Schema<ITour>({
  title: {
    type: String,
    required: [true, 'Tour title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Tour description is required']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  images: [{
    type: String,
    required: true
  }],
  duration: {
    days: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    nights: {
      type: Number,
      required: [true, 'Duration in nights is required'],
      min: [0, 'Nights cannot be negative']
    }
  },
  destinations: [{
    type: String,
    required: true
  }],
  startLocation: {
    name: {
      type: String,
      required: [true, 'Start location name is required']
    },
    address: {
      type: String,
      required: [true, 'Start location address is required']
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords: number[]) {
          return coords.length === 2;
        },
        message: 'Coordinates must be [longitude, latitude]'
      }
    }
  },
  endLocation: {
    name: {
      type: String,
      required: [true, 'End location name is required']
    },
    address: {
      type: String,
      required: [true, 'End location address is required']
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords: number[]) {
          return coords.length === 2;
        },
        message: 'Coordinates must be [longitude, latitude]'
      }
    }
  },
  price: {
    adult: {
      type: Number,
      required: [true, 'Adult price is required'],
      min: [0, 'Price cannot be negative']
    },
    child: {
      type: Number,
      required: [true, 'Child price is required'],
      min: [0, 'Price cannot be negative']
    },
    infant: {
      type: Number,
      required: [true, 'Infant price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      required: true,
      default: 'VND'
    }
  },
  discountPrice: {
    adult: Number,
    child: Number,
    infant: Number
  },
  inclusions: [{
    type: String,
    required: true
  }],
  exclusions: [{
    type: String,
    required: true
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [String],
    meals: [String],
    accommodation: String
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme'],
    required: true
  },
  category: {
    type: String,
    enum: ['cultural', 'adventure', 'beach', 'mountain', 'city', 'wildlife', 'spiritual', 'eco'],
    required: true
  },
  tags: [String],
  maxGroupSize: {
    type: Number,
    required: [true, 'Maximum group size is required'],
    min: [1, 'Group size must be at least 1']
  },
  minGroupSize: {
    type: Number,
    required: [true, 'Minimum group size is required'],
    min: [1, 'Group size must be at least 1']
  },
  ageRestriction: {
    minAge: {
      type: Number,
      min: [0, 'Age cannot be negative']
    },
    maxAge: {
      type: Number,
      min: [0, 'Age cannot be negative']
    }
  },
  languages: [{
    type: String,
    required: true
  }],
  tourGuide: {
    included: {
      type: Boolean,
      default: true
    },
    languages: [String]
  },
  transportation: {
    included: {
      type: Boolean,
      default: true
    },
    type: [String]
  },
  accommodation: {
    included: {
      type: Boolean,
      default: true
    },
    type: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  meals: {
    breakfast: {
      type: Boolean,
      default: false
    },
    lunch: {
      type: Boolean,
      default: false
    },
    dinner: {
      type: Boolean,
      default: false
    }
  },
  highlights: [String],
  requirements: [String],
  cancellationPolicy: {
    freeCancellation: {
      enabled: {
        type: Boolean,
        default: true
      },
      daysBeforeDeparture: {
        type: Number,
        default: 7
      }
    },
    cancellationFees: [{
      daysBeforeDeparture: {
        type: Number,
        required: true
      },
      feePercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      }
    }]
  },
  availability: [{
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    availableSlots: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      adult: Number,
      child: Number,
      infant: Number
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  reviews: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  promoted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
tourSchema.index({ slug: 1 });
tourSchema.index({ category: 1 });
tourSchema.index({ isActive: 1 });
tourSchema.index({ featured: 1 });
tourSchema.index({ promoted: 1 });
tourSchema.index({ 'price.adult': 1 });
tourSchema.index({ destinations: 1 });
tourSchema.index({ tags: 1 });
tourSchema.index({ averageRating: -1 });
tourSchema.index({ createdAt: -1 });

// Text index for search functionality
tourSchema.index({ 
  title: 'text', 
  description: 'text', 
  destinations: 'text',
  tags: 'text'
});

// GeoJSON index for location-based queries
tourSchema.index({ 'startLocation.coordinates': '2dsphere' });
tourSchema.index({ 'endLocation.coordinates': '2dsphere' });

// Pre-save middleware to generate slug
tourSchema.pre('save', function(next: any) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    // Remove leading/trailing hyphens
    if (this.slug.startsWith('-')) {
      this.slug = this.slug.substring(1);
    }
    if (this.slug.endsWith('-')) {
      this.slug = this.slug.substring(0, this.slug.length - 1);
    }
  }
  next();
});

// Virtual populate for reviews
tourSchema.virtual('reviewsPopulated', {
  ref: 'User',
  localField: 'reviews.user',
  foreignField: '_id'
});

export default mongoose.model<ITour>('Tour', tourSchema);
