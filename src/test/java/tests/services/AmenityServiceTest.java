package tests.services;

import com.example.demo.Amenities;
import com.example.demo.dto.AmenityCreateDto;
import com.example.demo.dto.AmenityDisplayDto;
import com.example.demo.entities.Amenity;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.AmenityMapper;
import com.example.demo.repository.AmenityRepository;

import com.example.demo.service.AmenityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AmenityServiceTest {

    @Mock
    private AmenityRepository amenityRepository;

    @Mock
    private AmenityMapper amenityMapper;

    @InjectMocks
    private AmenityService amenityService;

    private Amenity amenity;
    private AmenityDisplayDto displayDto;
    private AmenityCreateDto createDto;

    @BeforeEach
    void setup() {
        amenity = new Amenity();
        amenity.setId(1L);

        displayDto = new AmenityDisplayDto();

        createDto = new AmenityCreateDto();
        createDto.setAmenities(Amenities.WIFI);
    }

    @Test
    void createAmenity_success() {
        when(amenityMapper.toEntity(createDto)).thenReturn(amenity);
        when(amenityRepository.save(amenity)).thenReturn(amenity);
        when(amenityMapper.toDisplayDto(amenity)).thenReturn(displayDto);

        AmenityDisplayDto result = amenityService.createAmenity(createDto);

        assertNotNull(result);
        verify(amenityRepository).save(amenity);
    }

    @Test
    void getAllAmenities_success() {
        when(amenityRepository.findAll()).thenReturn(List.of(amenity));
        when(amenityMapper.toDisplayDto(amenity)).thenReturn(displayDto);

        List<AmenityDisplayDto> result = amenityService.getAllAmenities();

        assertEquals(1, result.size());
    }

    @Test
    void createAmenitiesBulkTransactional_success() {
        when(amenityMapper.toEntity(any())).thenReturn(amenity);
        when(amenityRepository.save(any())).thenReturn(amenity);
        when(amenityMapper.toDisplayDto(any())).thenReturn(displayDto);

        List<AmenityDisplayDto> result =
            amenityService.createAmenitiesBulkTransactional(List.of(createDto));

        assertEquals(1, result.size());
    }

    @Test
    void createAmenitiesBulkTransactional_nullDto() {
        List<AmenityCreateDto> list = new java.util.ArrayList<>();
        list.add(null);

        assertThrows(ResourceNotFoundException.class,
            () -> amenityService.createAmenitiesBulkTransactional(list));
    }

    @Test
    void createAmenitiesBulkTransactional_errorName() {
        AmenityCreateDto dto = new AmenityCreateDto();
        dto.setAmenities(Amenities.ERRORNAME);

        assertThrows(BadRequestException.class,
            () -> {amenityService.createAmenitiesBulkTransactional(List.of(dto));});
    }

    @Test
    void createAmenitiesBulkWithoutTransaction_success() {
        when(amenityMapper.toEntity(any())).thenReturn(amenity);
        when(amenityRepository.save(any())).thenReturn(amenity);
        when(amenityMapper.toDisplayDto(any())).thenReturn(displayDto);

        List<AmenityDisplayDto> result =
            amenityService.createAmenitiesBulkWithoutTransaction(List.of(createDto));

        assertEquals(1, result.size());
    }

    @Test
    void createAmenitiesBulkWithoutTransaction_nullDto() {
        List<AmenityCreateDto> list = new java.util.ArrayList<>();
        list.add(null);

        assertThrows(ResourceNotFoundException.class,
            () -> amenityService.createAmenitiesBulkWithoutTransaction(list));
    }

    @Test
    void createAmenitiesBulkWithoutTransaction_errorName() {
        AmenityCreateDto dto = new AmenityCreateDto();
        dto.setAmenities(Amenities.ERRORNAME);

        assertThrows(BadRequestException.class,
            () -> {amenityService.createAmenitiesBulkWithoutTransaction(List.of(dto));});
    }

    @Test
    void getAmenityById_success() {
        when(amenityRepository.findById(1L)).thenReturn(Optional.of(amenity));
        when(amenityMapper.toDisplayDto(amenity)).thenReturn(displayDto);

        AmenityDisplayDto result = amenityService.getAmenityById(1L);

        assertNotNull(result);
    }

    @Test
    void getAmenityById_notFound() {
        when(amenityRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> amenityService.getAmenityById(1L));
    }

    @Test
    void updateAmenity_success() {
        when(amenityRepository.findById(1L)).thenReturn(Optional.of(amenity));
        when(amenityRepository.save(amenity)).thenReturn(amenity);
        when(amenityMapper.toDisplayDto(amenity)).thenReturn(displayDto);

        AmenityDisplayDto result = amenityService.updateAmenity(1L, createDto);

        assertNotNull(result);
        assertEquals(Amenities.WIFI, amenity.getName());
    }

    @Test
    void updateAmenity_notFound() {
        when(amenityRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> amenityService.updateAmenity(1L, createDto));
    }

    @Test
    void deleteAmenity_success() {
        when(amenityRepository.existsById(1L)).thenReturn(true);

        amenityService.deleteAmenity(1L);

        verify(amenityRepository).deleteById(1L);
    }

    @Test
    void deleteAmenity_notFound() {
        when(amenityRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
            () -> amenityService.deleteAmenity(1L));

        verify(amenityRepository, never()).deleteById(any());
    }
}