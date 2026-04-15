package tests.services;

import com.example.demo.dto.AirportCreateDto;
import com.example.demo.dto.AirportDisplayDto;
import com.example.demo.entities.Airport;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.AirportMapper;
import com.example.demo.repository.AirportRepository;

import com.example.demo.service.AirportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AirportServiceTest {

    @Mock
    private AirportRepository airportRepository;

    @Mock
    private AirportMapper airportMapper;

    @InjectMocks
    private AirportService airportService;

    private Airport airport;
    private AirportCreateDto createDto;
    private AirportDisplayDto displayDto;

    @BeforeEach
    void setUp() {
        airport = new Airport();
        airport.setCity("Paris");
        airport.setCountry("France");

        createDto = new AirportCreateDto();
        createDto.setCity("Paris");
        createDto.setCountry("France");

        displayDto = new AirportDisplayDto();
        displayDto.setCity("Paris");
        displayDto.setCountry("France");
    }

    // -------- CREATE --------
    @Test
    void createAirport_success() {
        when(airportMapper.toEntity(createDto)).thenReturn(airport);
        when(airportRepository.save(airport)).thenReturn(airport);
        when(airportMapper.toDisplayDto(airport)).thenReturn(displayDto);

        AirportDisplayDto result = airportService.createAirport(createDto);

        assertNotNull(result);
        verify(airportMapper).toEntity(createDto);
        verify(airportRepository).save(airport);
        verify(airportMapper).toDisplayDto(airport);
    }

    // -------- BULK TRANSACTIONAL --------
    @Test
    void createAirportsBulkTransactional_success() {
        when(airportMapper.toEntity(createDto)).thenReturn(airport);
        when(airportRepository.save(airport)).thenReturn(airport);
        when(airportMapper.toDisplayDto(airport)).thenReturn(displayDto);

        List<AirportDisplayDto> result =
            airportService.createAirportsBulkTransactinal(List.of(createDto));

        assertEquals(1, result.size());

        verify(airportMapper).toEntity(createDto);
        verify(airportRepository).save(airport);
        verify(airportMapper).toDisplayDto(airport);
    }

    @Test
    void createAirportsBulkTransactional_nullDto() {
        List<AirportCreateDto> list = new ArrayList<>();
        list.add(null);

        assertThrows(ResourceNotFoundException.class,
            () -> airportService.createAirportsBulkTransactinal(list));
    }

    @Test
    void createAirportsBulkTransactional_errorCity() {
        AirportCreateDto badDto = new AirportCreateDto();
        badDto.setCity("ErrorCity");

        assertThrows(BadRequestException.class,
            () -> airportService.createAirportsBulkTransactinal(List.of(badDto)));
    }

    // -------- BULK NON-TRANSACTIONAL --------
    @Test
    void createAirportsBulk_success() {
        when(airportMapper.toEntity(createDto)).thenReturn(airport);
        when(airportRepository.save(airport)).thenReturn(airport);
        when(airportMapper.toDisplayDto(airport)).thenReturn(displayDto);

        List<AirportDisplayDto> result =
            airportService.createAirportsBulk(List.of(createDto));

        assertEquals(1, result.size());

        verify(airportMapper).toEntity(createDto);
        verify(airportRepository).save(airport);
        verify(airportMapper).toDisplayDto(airport);
    }

    @Test
    void createAirportsBulk_nullDto() {
        List<AirportCreateDto> list = new ArrayList<>();
        list.add(null);

        assertThrows(ResourceNotFoundException.class,
            () -> airportService.createAirportsBulk(list));
    }

    @Test
    void createAirportsBulk_errorCity() {
        AirportCreateDto badDto = new AirportCreateDto();
        badDto.setCity("ErrorCity");

        assertThrows(BadRequestException.class,
            () -> airportService.createAirportsBulk(List.of(badDto)));
    }

    // -------- GET ALL --------
    @Test
    void getAllAirports_success() {
        when(airportRepository.findAll()).thenReturn(List.of(airport));
        when(airportMapper.toDisplayDto(airport)).thenReturn(displayDto);

        List<AirportDisplayDto> result = airportService.getAllAirports();

        assertEquals(1, result.size());
        verify(airportMapper).toDisplayDto(airport);
    }

    // -------- GET BY ID --------
    @Test
    void getAirportByCode_success() {
        when(airportRepository.findById(1L)).thenReturn(Optional.of(airport));
        when(airportMapper.toDisplayDto(airport)).thenReturn(displayDto);

        AirportDisplayDto result = airportService.getAirportByCode(1L);

        assertNotNull(result);
    }

    @Test
    void getAirportByCode_notFound() {
        when(airportRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> airportService.getAirportByCode(1L));
    }

    // -------- UPDATE --------
    @Test
    void updateAirport_success() {
        AirportCreateDto updateDto = new AirportCreateDto();
        updateDto.setCity("London");
        updateDto.setCountry("UK");

        when(airportRepository.findById(1L)).thenReturn(Optional.of(airport));
        when(airportRepository.save(airport)).thenReturn(airport);
        when(airportMapper.toDisplayDto(airport)).thenReturn(displayDto);

        AirportDisplayDto result = airportService.updateAirport(1L, updateDto);

        assertNotNull(result);
        assertEquals("London", airport.getCity());
        assertEquals("UK", airport.getCountry());
    }

    @Test
    void updateAirport_notFound() {
        when(airportRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> airportService.updateAirport(1L, createDto));
    }

    // -------- DELETE --------
    @Test
    void deleteAirport_success() {
        when(airportRepository.existsById(1L)).thenReturn(true);

        airportService.deleteAirport(1L);

        verify(airportRepository).deleteById(1L);
    }

    @Test
    void deleteAirport_notFound() {
        when(airportRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
            () -> airportService.deleteAirport(1L));

        verify(airportRepository, never()).deleteById(any());
    }
}