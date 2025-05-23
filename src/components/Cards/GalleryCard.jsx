import i18next from "i18next";
import React, { useState } from "react";
import Masonry from "react-masonry-css";
import { useData } from "../../contexts/DataContext";

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 2,
};

const ImageGallery = () => {
  const data = useData();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImageIds, setLoadedImageIds] = useState(new Set());

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const showPrev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? visibleImages.length - 1 : prev - 1
    );

  const showNext = () =>
    setCurrentIndex((prev) =>
      prev === visibleImages.length - 1 ? 0 : prev + 1
    );

  const handleImageLoad = (id) => {
    setLoadedImageIds((prev) => new Set(prev).add(id));
  };

  const allImages = (data._gallery_categories.data || []).flatMap((cat) =>
    cat.images.map((img) => ({
      ...img,
      category: cat,
      src: `${data.APP_BASE_URL + "/file/" + img.url}`,
      categoryId: cat.id,
    }))
  );

  const filteredImages =
    selectedCategory === "all"
      ? allImages
      : allImages.filter((img) => img.categoryId === selectedCategory);

  const visibleImages = filteredImages.filter((img) =>
    loadedImageIds.has(img.id)
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Category Buttons */}
      <div className="flex justify-center flex-wrap gap-4 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === "all"
              ? "bg-rose-600 text-white"
              : "bg-white text-black hover:bg-gray-100"
          } transition`}
        >
          {i18next.language === "pt" ? "Todos" : "All"}
        </button>

        {(data._gallery_categories.data || []).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat.id
                ? "bg-rose-600 text-white"
                : "bg-white text-black hover:bg-gray-100"
            } transition`}
          >
            {cat["name_" + i18next.language]}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="bg-clip-padding"
      >
        {filteredImages.map((img, index) => (
          <div
            key={img.id}
            className={`transition-opacity relative duration-500 ease-in-out ${
              loadedImageIds.has(img.id) ? "opacity-100" : "opacity-0"
            } bg-gray-400`}
          >
            <img
              src={img.src}
              alt={`Gallery ${index}`}
              className="w-full rounded mb-4 shadow-md cursor-pointer active:opacity-95 md:hover:scale-105 transition-transform"
              onClick={() => openModal(index)}
              onLoad={() => handleImageLoad(img.id)}
            />
            {(img["title_" + i18next.language]) && (
              <div className="absolute pointer-events-none bottom-2 left-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-md">
                {img["title_" + i18next.language]}
              </div>
            )}
          </div>
        ))}
      </Masonry>

      {/* Modal */}
      {isOpen && visibleImages[currentIndex] && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-center mb-2">
              <button
                onClick={closeModal}
                className="text-white text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            <img
              src={visibleImages[currentIndex].src}
              alt={`Preview ${currentIndex}`}
              className="max-h-[80vh] w-full object-contain rounded mx-auto"
            />
            <button
              onClick={showPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold"
            >
              ‹
            </button>
            <button
              onClick={showNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
